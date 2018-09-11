import { Document } from 'sketch/dom';
import UI from 'sketch/ui';

import ScLayer from './ScLayer';

export default function() {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if(selection.isEmpty) {
    UI.alert('Warn', 'At lease one layer must be selected!');
    return;
  }
  let list = [];
  selection.map((item) => {
    let scLayer = new ScLayer(item);
    scLayer.parse();
    list.push(scLayer);
  });
  let options = ['Desktop', 'Documents', 'Downloads', 'Custom'];
  let sel = UI.getSelectionFromUser(
    "Please choose your output directory:",
    options
  );
  let ok = sel[2];
  let value = options[sel[1]];
  if(ok) {
    let output = `~/${value}/sketch2code`;
    console.log(output);
  }
};
