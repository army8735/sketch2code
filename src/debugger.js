'use strict';

import { export as expt, Document } from 'sketch/dom';
import UI from 'sketch/ui';

import preCheck from './preCheck';
import format from './format';
import flatten from './flatten';
import util from './util';
import template from './template';

export function formats() {
  let list = format();
  if(!list) {
    return;
  }
  let message = [];
  list.forEach(item => {
    let directory = `${NSHomeDirectory()}/Documents/sketch2code/format`;
    let fileManager = NSFileManager.defaultManager();
    if(!fileManager.fileExistsAtPath(NSString.stringWithString(directory))) {
      fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(NSString.stringWithString(directory), true, null, null);
    }
    let dir = `${directory}/${item.id}.json`;
    message.push(dir);
    let json = item.toJSON();
    let s = JSON.stringify(json, null, 2);
    NSString.stringWithString(s).writeToFile_atomically_encoding_error(NSString.stringWithString(dir), false, NSUTF8StringEncoding, null);
  });
  UI.alert('Message', `JSON data have been outputing to:\n${message.join('\n')}`);
}

export function flattens() {
  let selection = preCheck();
  if(!selection) {
    return;
  }
  let check = [];
  selection.forEach(item => {
    let dir = `${NSHomeDirectory()}/Documents/sketch2code/format/${item.id}.json`;
    let fileManager = NSFileManager.defaultManager();
    if(!fileManager.fileExistsAtPath(NSString.stringWithString(dir))) {
      check.push(dir);
    }
  });
  if(check.length) {
    UI.alert('Warn', `JSON data must be prepared by format command:\n${check.join('\n')}`);
    return;
  }
  let list = [];
  selection.forEach(item => {
    let dir = `${NSHomeDirectory()}/Documents/sketch2code/format/${item.id}.json`;
    let fileHandler = NSFileHandle.fileHandleForReadingAtPath(dir);
    let data = fileHandler.readDataToEndOfFile();
    let s = NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
    let json = JSON.parse(s);
    list.push(json);
  });
  let arr = list.map(item => {
    return flatten(item);
  });
  let message = [];
  arr.forEach((item, i) => {
    let directory = `${NSHomeDirectory()}/Documents/sketch2code/flatten`;
    let fileManager = NSFileManager.defaultManager();
    if(!fileManager.fileExistsAtPath(NSString.stringWithString(directory))) {
      fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(NSString.stringWithString(directory), true, null, null);
    }
    let id = list[i].id;
    let dir = `${directory}/${id}.json`;
    let s = JSON.stringify(item, null, 2);
    NSString.stringWithString(s).writeToFile_atomically_encoding_error(NSString.stringWithString(dir), false, NSUTF8StringEncoding, null);
    dir = `${directory}/${id}.html`;
    message.push(dir);
    let document = Document.getSelectedDocument();
    let layer = document.getLayerWithID(id);
    let artboard = util.getTopArtboard(layer);
    let pageWidth = artboard.frame.width;
    let pageHeight = artboard.frame.height;
    item.forEach(data => {
      let layer = document.getLayerWithID(data.id);
      expt(layer, {
        output: `${directory}`,
        'use-id-for-name': true,
        overwriting: true,
        'save-for-web': true,
      });
    });
    s = template({
      pageWidth,
      pageHeight,
      item,
    });
    NSString.stringWithString(s).writeToFile_atomically_encoding_error(NSString.stringWithString(dir), false, NSUTF8StringEncoding, null);
  });
  UI.alert('Message', `JSON flattener have been outputing to:\n${message.join('\n')}`);
}
