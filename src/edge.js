'use strict';

import sort from './sort';

export default function(json) {
  let left;
  let top;
  let right;
  let bottom;
  let originHorizontal = [];
  let originVertical = [];
  json.forEach((item, i) => {
    if(i) {
      left = Math.min(left, item.xs);
      right = Math.max(right, item.xs + item.width);
      top = Math.min(top, item.ys);
      bottom = Math.max(bottom, item.ys + item.height);
    }
    else {
      left = item.xs;
      right = item.xs + item.width;
      top = item.ys;
      bottom = item.ys + item.height;
    }
    originHorizontal.push({
      x: [item.xs, item.xs + item.width],
      y: item.ys,
    });
    originHorizontal.push({
      x: [item.xs, item.xs + item.width],
      y: item.ys + item.height,
    });
    originVertical.push({
      x: item.xs,
      y: [item.ys, item.ys + item.height],
    });
    originVertical.push({
      x: item.xs + item.width,
      y: [item.ys, item.ys + item.height],
    });
  });
  sort(originHorizontal, (a, b) => {
    if(a.y === b.y) {
      return a.x[0] > b.x[0];
    }
    return a.y > b.y;
  });
  sort(originVertical, (a, b) => {
    if(a.x === b.x) {
      return a.y[0] > b.y[0];
    }
    return a.x > b.x;
  });
  let horizontal = [];
  let vertical = [];
  originHorizontal.forEach(item => {
    // if(item.x[0])
  });
  return {
    originHorizontal,
    originVertical,
    horizontal,
    vertical,
  };
}
