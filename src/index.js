import { Document } from 'sketch/dom';
import UI from 'sketch/ui';

import preCheck from './preCheck';
import format from './format';
import flatten from './flatten';

export default function() {
  let selection = preCheck();
  if(selection === null) {
    UI.alert('Warn', 'At lease one layer must be selected!');
    return;
  }
  let list = format(selection);
  if(!list.length) {
    UI.alert('Warn', 'No avalible layer can be output!');
    return;
  }
  list.forEach(item => {
    flatten(item);
  });
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
      scLayer.output(path);
    });
  }
};
