'use strict';

import type from './type';

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
  get name() {
    return this.layer.name;
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
  get image() {
    return !!this._image;
  }
  set image(v) {
    this._image = !!v;
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
  get relative() {
    return !!this._relative;
  }
  set relative(v) {
    this._relative = !!v;
  }
  get x() {
    return this.layer.frame.x;
  }
  get y() {
    return this.layer.frame.y;
  }
  // get xs() {
  //   let x = this.x;
  //   if(this.parent) {
  //     x += this.parent.xs;
  //   }
  //   return x;
  // }
  // get ys() {
  //   let y = this.y;
  //   if(this.parent) {
  //     y += this.parent.ys;
  //   }
  //   return y;
  // }
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
      let layers;
      if(this.type === type.SYMBOL_INSTANCE) {
        layers = this.layer.master.layers;
      }
      else {
        layers = this.layer.layers;
      }
      layers.forEach(layer => {
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
        let scLayer = ScLayer.getInstance(layer, this.artboard);
        scLayer.parse();
        if(scLayer.type === type.GROUP) {
          // 过滤空组
          if(!scLayer.children) {
            return;
          }
          // 纯图片组标识image
          let allImage = true;
          scLayer.children.forEach(item => {
            if(item.type === type.GROUP) {
              if(!item.image) {
                allImage = false;
              }
            }
            else if(item.type !== type.SHAPE && item.type !== item.IMAGE) {
              allImage = false;
            }
          });
          if(allImage) {
            scLayer.image = true;
          }
        }
        scLayer.parent = this;
        this._children = this._children || [];
        this.children.push(scLayer);
      });
    }
  }

  toJSON() {
    if(this._json) {
      return this._json;
    }
    let childrenJson = null;
    if(this.children) {
      childrenJson = this.children.map(child => {
        return child.toJSON();
      });
    }
    return this._json = {
      id: this.id,
      name: this.name,
      type: this.type,
      meta: this.meta,
      image: this.image,
      background: this.background,
      absolute: this.absolute,
      relative: this.relative,
      x: this.x,
      y: this.y,
      // xs: this.xs,
      // ys: this.ys,
      width: this.width,
      height: this.height,
      children: childrenJson,
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

  static getInstance(layer, artboard) {
    let id = layer.id;
    if(CACHE.has(id)) {
      return CACHE.get(id);
    }
    return new ScLayer(layer, artboard);
  }
}

export default ScLayer;
