'use strict';

import { Document } from 'sketch/dom';

export default function() {
  let document = Document.getSelectedDocument();
  let selection = document.selectedLayers;
  if(selection.isEmpty) {
    return null;
  }
  return selection;
};
