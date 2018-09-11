'use strict';

import type from './type';
import factory from './factory';

const CACHE = new Map();

class ScLayer {
  constructor(layer, artboard) {
    this._layer = layer;
    this._artboard = artboard;
  }

  get layer() {
    return this._layer;
  }
  get artboard() {
    return this._artboard;
  }
  get id() {
    return this.layer.id;
  }
  get type() {
    return this.layer.type;
  }
  get meta() {
    return [type.IMAGE, type.SHAPE, type.TEXT].indexOf(this.type) > -1;
  }
  get hasParsed() {
    return !!this._hasParsed;
  }
  set hasParsed(v) {
    this._hasParsed = !!v;
  }
  get parent() {
    return this._parent || null;
  }
  set parent(v) {
    this._parent = v;
  }
  get children() {
    return this._children || null;
  }
  get background() {
    return !!this._background;
  }
  set background(v) {
    this._background = !!v;
  }
  get absolute() {
    return !!this._absolute;
  }
  set absolute(v) {
    this._absolute = !!v;
  }
  get x() {
    return this.layer.frame.x;
  }
  get y() {
    return this.layer.frame.y;
  }
  get width() {
    return this.layer.frame.width;
  }
  get height() {
    return this.layer.frame.height;
  }

  parse() {
    if(this.hasParsed) {
      return;
    }
    if(this.layer.hidden) {
      return;
    }
    if(this.layer.style.opacity === 0) {
      return;
    }
    if(this.x < 0 && this.width < this.artboard.frame.width) {
      return;
    }
    if(this.x > this.artboard.frame.width) {
      return;
    }
    if(this.y < 0 && this.height < this.artboard.frame.height) {
      return;
    }
    if(this.y > this.artboard.frame.height) {
      return;
    }
    this.hasParsed = true;
    // 递归遍历设置父子关系，以及过滤掉隐藏的、超出范围的和空的图层
    if(!this.meta) {
      this.layer.layers.forEach(layer => {
        if(layer.hidden) {
          return;
        }
        if(layer.style.opacity === 0) {
          return;
        }
        if(layer.frame.x < 0 && layer.frame.width < this.artboard.frame.width) {
          return;
        }
        if(layer.frame.x > this.artboard.frame.width) {
          return;
        }
        if(layer.frame.y < 0 && layer.frame.height < this.artboard.frame.height) {
          return;
        }
        if(layer.frame.y > this.artboard.frame.height) {
          return;
        }
        let scLayer = factory.getInstance(layer, this.artboard);
        scLayer.parse();
        if(scLayer.type === type.GROUP && !scLayer.children) {
          return;
        }
        scLayer.parent = this;
        this._children = this._children || [];
        this.children.push(scLayer);
      });
    }
  }

  toJSON() {
    let childrenJson = null;
    if(this.children) {
      childrenJson = this.children.map(child => {
        return child.toJSON();
      });
    }
    return {
      id: this.id,
      type: this.type,
      meta: this.meta,
      children: childrenJson,
      background: this.background,
      absolute: this.absolute,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }

  output(path) {
    if(!this.meta) {
      //
    }
  }

  static getInstance(layer) {
    let id = layer.id;
    if(CACHE.has(id)) {
      return CACHE.get(id);
    }
    switch(layer.type) {
      case type.GROUP:
        return new ScGroup(layer);
      case type.IMAGE:
        return new ScImage(layer);
      case type.TEXT:
        return new ScText(layer);
      case type.SHAPE:
        return new ScShape(layer);
      case type.ARTBOARD:
        return new ScArtboard(layer);
    }
  }
}

export default ScLayer;
