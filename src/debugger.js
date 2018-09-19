'use strict';

import { Document } from 'sketch/dom';
import UI from 'sketch/ui';

import preCheck from './preCheck';
import format from './format';
import flatten from './flatten';

export function formats() {
  let selection = preCheck();
  if(selection === null || selection.length !== 1) {
    UI.alert('Error', 'At lease one layer must be selected!');
    return;
  }
  let list = format(selection);
  let message = [];
  list.forEach(item => {
    let directory = `${NSHomeDirectory()}/Documents/sketch2code`;
    let defaultManager = NSFileManager.defaultManager();
    if(!defaultManager.fileExistsAtPath(NSString.stringWithString(directory))) {
      defaultManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(NSString.stringWithString(directory), true, null, null);
    }
    let dir = `${directory}/${item.id}.json`;
    message.push(dir);
    let json = item.toJSON();
    let s = JSON.stringify(json, null, 2);
    NSString.stringWithString(s).writeToFile_atomically_encoding_error(NSString.stringWithString(dir), false, NSUTF8StringEncoding, null);
  });
  UI.alert('Message', `JSON data have been outputing to:\n${message.join('\n')}`);
}

export function flattens(data) {

}
