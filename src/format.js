'use strict';

import ScLayer from './ScLayer';
import util from './util';

export default function(selection) {
  let list = [];
  selection.map(item => {
    let artboard = util.getTopArtboard(item);
    let scLayer = ScLayer.getInstance(item, artboard);
    if(scLayer) {
      scLayer.parse();
      if(!scLayer.meta) {
        list.push(scLayer);
      }
    }
  });
  return list;
};
