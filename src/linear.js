'use strict';

export default function(json) {
  let background = [];
  let foreground = [];
  json.forEach(item => {
    if(item.isBackground) {
      background.push(item);
      return;
    }
    let top = item.ys;
    let bottom = item.ys + item.height;
    for(let i = 0; i < foreground.length; i++) {
      let exist = foreground[i];
      if(bottom <= exist.top || top >= exist.bottom) {
        //
      }
      else {
        exist.list.push(item);
        return;
      }
    }
    let exist = {
      top,
      bottom,
      list: [item],
    };
    foreground.push(exist);
  });
  return {
    background,
    foreground,
  };
}
