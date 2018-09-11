'use strict';

import type from './type';

export default {
  getTopArtboard(layer) {
    if(!layer) {
      return null;
    }
    do {
      if(layer.type === type.ARTBOARD) {
        return layer;
      }
      layer = layer.parent;
    }
    while(layer.parent);
    return null;
  },
};
