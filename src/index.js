import { Document } from 'sketch/dom';
import UI from 'sketch/ui';

import factory from './factory';
import util from './util';

export default function() {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if(selection.isEmpty) {
    UI.alert('Warn', 'At lease one layer must be selected!');
    return;
  }
  let list = [];
  selection.map(item => {
    let artboard = util.getTopArtboard(item);
    let scLayer = factory.getInstance(item, artboard);
    if(scLayer) {
      scLayer.parse();
      if(!scLayer.meta) {
        list.push(scLayer);
      }
    }
  });
  if(!list.length) {
    UI.alert('Warn', 'No avalible layer can be output!');
    return;
  }
  let options = ['Desktop', 'Documents', 'Downloads'];
  let sel = UI.getSelectionFromUser(
    "Please choose your output directory:",
    options
  );
  let ok = sel[2];
  let value = options[sel[1]];
  if(ok) {
    let path = `~/${value}/sketch2code`;
    list.forEach((scLayer) => {
      // scLayer.output(path);
      console.log(scLayer.toJSON());
    });
  }
};
