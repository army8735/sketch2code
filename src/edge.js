'use strict';

import sort from './sort';

function isCross(h, v) {
  if(h.y < v.y[0] || h.y > v.y[1]) {
    return false;
  }
  if(v.x < h.x[0] || v.x > h.x[1]) {
    return false;
  }
  if(h.y === v.y[0] || h.y === v.y[1]) {
    return h.x[0] !== v.x && h.x[1] !== v.x;
  }
  if(v.x === h.x[0] || v.x === h.x[1]) {
    return v.y[0] !== h.y && v.y[1] !== h.y;
  }
  return true;
}

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
  sort(originHorizontal, (a, b)   => {
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
  let extendHorizontal = [];
  let extendVertical = [];
  originHorizontal.forEach(item => {
    let x0 = left;
    let x1 = right;
    if(item.x[0] > left) {
      for(let i = 0; i < originVertical.length; i++) {
        if(originVertical[i].x >= item.x[0]) {
          break;
        }
        else if(isCross({ x: [x0, x1], y: item.y }, originVertical[i])) {
          x0 = originVertical[i].x;
        }
      }
    }
    if(item.x[1] < right) {
      for(let i = originVertical.length - 1; i >= 0; i--) {
        if(originVertical[i].x <= item.x[1]) {
          break;
        }
        else if(isCross({ x: [x0, x1], y: item.y }, originVertical[i])) {
          x1 = originVertical[i].x;
          break;
        }
      }
    }
    extendHorizontal.push({
      x: [x0, x1],
      y: item.y,
    });
  });
  originVertical.forEach(item => {
    let y0 = top;
    let y1 = bottom;
    if(item.y[0] > top) {
      for(let i = 0; i < originHorizontal.length; i++) {
        if(originHorizontal[i].y >= item.y[0]) {
          break;
        }
        else if(isCross(originHorizontal[i], { x: item.x, y: [y0, y1] })) {
          y0 = originHorizontal[i].y;
        }
      }
    }
    if(item.y[1] < bottom) {
      for(let i = originHorizontal.length - 1; i >= 0; i--) {
        if(originHorizontal[i].y <= item.y[1]) {
          break;
        }
        else if(isCross(originHorizontal[i], { x: item.x, y: [y0, y1] })) {
          y1 = originHorizontal[i].y;
        }
      }
    }
    extendVertical.push({
      x: item.x,
      y: [y0, y1],
    });
  });
  return {
    originHorizontal,
    originVertical,
    extendHorizontal,
    extendVertical,
  };
}
