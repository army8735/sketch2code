'use strict';

import { Document } from 'sketch/dom';
import UI from 'sketch/ui';

import preCheck from './preCheck';
import format from './format';

export function formats() {
  let selection = preCheck();
  if(selection === null || selection.length !== 1) {
    UI.alert('Error', 'At lease one layer must be selected!');
    return;
  }
  let list = format(selection);
  let message = [];
  list.forEach(item => {
    let dir = `~/Documents/sketch2code/${item.id}/format.json`;
    message.push(dir);
    let json = item.toJSON();
    let s = JSON.stringify(json, null, 2);
    console.log(json);
    // fs.writeFileSync(dir, s, { encoding: 'utf-8', });
  });
  UI.alert('Message', `JSON data have been outputing to:\n${message.join('\n')}`);
}
