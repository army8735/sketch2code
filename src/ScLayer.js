'use strict';

import type from './type';
import ScGroup from './ScGroup';
import ScImage from './ScImage';
import ScText from './ScText';
import ScShape from './ScShape';
import ScArtboard from './ScArtboard';

class ScLayer {
  constructor(layer) {
    this.layer = layer;
    this.id = this.layer.id;
    this.type = this.layer.type;
    this.meta = [type.IMAGE, type.SHAPE, type.TEXT].indexOf(this.type) > -1;
  }
  parse() {
  }
  output(path) {
    if(this.type && this.type) {
      console.log(path);
    }
  }

  static generate(layer) {
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
