'use strict';

import type from './type';
import ScGroup from './ScGroup';
import ScImage from './ScImage';
import ScText from './ScText';
import ScShape from './ScShape';
import ScArtboard from './ScArtboard';

const CACHE = new Map();

export default {
  getInstance(layer, artboard) {
    let id = layer.id;
    if(CACHE.has(id)) {
      return CACHE.get(id);
    }
    switch(layer.type) {
      case type.GROUP:
        return new ScGroup(layer, artboard);
      case type.IMAGE:
        return new ScImage(layer, artboard);
      case type.TEXT:
        return new ScText(layer, artboard);
      case type.SHAPE:
        return new ScShape(layer, artboard);
      case type.ARTBOARD:
        return new ScArtboard(layer, artboard);
    }
  },
};
