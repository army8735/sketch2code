'use strict';

import lodash from 'lodash';
import sort from './sort';

function getOrigin(json) {
  let left = -1;
  let top = -1;
  let right = -1;
  let bottom = -1;
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
      st: true,
      i,
    });
    originHorizontal.push({
      x: [item.xs, item.xs + item.width],
      y: item.ys + item.height,
      st: false,
      i,
    });
    originVertical.push({
      x: item.xs,
      y: [item.ys, item.ys + item.height],
      st: true,
      i,
    });
    originVertical.push({
      x: item.xs + item.width,
      y: [item.ys, item.ys + item.height],
      st: false,
      i,
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
  return {
    top,
    right,
    bottom,
    left,
    originHorizontal,
    originVertical,
  };
}

function getExtend(top, right, bottom, left, originHorizontal, originVertical) {
  let extendHorizontal = [];
  let extendVertical = [];
  let hash = new Map();
  originHorizontal.forEach(item => {
    let x0 = left;
    let x1 = right;
    if(item.x[0] > left) {
      for(let i = originVertical.length - 1; i >= 0; i--) {
        let l = originVertical[i];
        if(l.x < item.x[0]) {
          for(let j = i; j >= 0; j--) {
            let l = originVertical[j];
            x0 = l.x;
            if(isCross({ x: [x0, x1], y: item.y }, l)) {
              break;
            }
          }
          break;
        }
      }
    }
    if(item.x[1] < right) {
      for(let i = 0; i < originVertical.length; i++) {
        let l = originVertical[i];
        if(l.x > item.x[1]) {
          for(let j = i; j < originVertical.length; j++) {
            let l = originVertical[j];
            x1 = l.x;
            if(isCross({ x: [x0, x1], y: item.y }, l)) {
              break;
            }
          }
          break;
        }
      }
    }
    let key = x0 + ':' + x1 + '|' + item.y + '|' + item.st;
    if(hash.has(key)) {
      return;
    }
    hash.set(key, true);
    extendHorizontal.push({
      x: [x0, x1],
      y: item.y,
      st: item.st,
      i: item.i,
    });
  });
  hash = new Map();
  originVertical.forEach(item => {
    let y0 = top;
    let y1 = bottom;
    if(item.y[0] > top) {
      for(let i = originHorizontal.length - 1; i >= 0; i--) {
        let l = originHorizontal[i];
        if(l.y < item.y[0]) {
          for(let j = i; j >= 0; j--) {
            let l = originHorizontal[j];
            y0 = l.y;
            if(isCross(l, { x: item.x, y: [y0, y1] })) {
              break;
            }
          }
          break;
        }
      }
    }
    if(item.y[1] < bottom) {
      for(let i = 0; i < originHorizontal.length; i++) {
        let l = originHorizontal[i];
        if(l.y > item.y[1]) {
          for(let j = i; j < originHorizontal.length; j++) {
            let l = originHorizontal[j];
            y1 = l.y;
            if(isCross(l, { x: item.x, y: [y0, y1] })) {
              break;
            }
          }
          break;
        }
      }
    }
    let key = item.x + '|' + y0 + ':' + y1 + '|' + item.st;
    if(hash.has(key)) {
      return;
    }
    hash.set(key, true);
    extendVertical.push({
      x: item.x,
      y: [y0, y1],
      st: item.st,
      i: item.i,
    });
  });
  return {
    extendHorizontal,
    extendVertical,
  };
}

function getMerge(extendHorizontal, extendVertical) {
  let mergeHorizontal = [];
  let mergeVertical = [];
  let xHash = new Map();
  let yHash = new Map();
  for(let i = 0; i < extendHorizontal.length - 1; i++) {
    let a = extendHorizontal[i];
    let b = extendHorizontal[i + 1];
    a = lodash.cloneDeep(a);
    if(a.i !== b.i && a.st !== b.st && a.x[0] === b.x[0] && a.x[1] === b.x[1]) {
      i++;
      let y = (a.y + b.y) >> 1;
      let arr;
      if(xHash.has(a.y)) {
        arr = xHash.get(a.y);
      }
      else {
        arr = [];
        xHash.set(a.y, arr);
      }
      arr.push({
        y,
        x: a.x,
      });
      a.y = y;
      mergeHorizontal.push(a);
      let arr2;
      if(xHash.has(b.y)) {
        arr2 = xHash.get(b.y);
      }
      else {
        arr2 = [];
        xHash.set(b.y, arr2);
      }
      arr2.push({
        y,
        x: b.x,
      });
    }
    else {
      mergeHorizontal.push(a);
    }
  }
  mergeHorizontal.push(extendHorizontal[extendHorizontal.length - 1]);
  for(let i = 0; i < extendVertical.length - 1; i++) {
    let a = extendVertical[i];
    let b = extendVertical[i + 1];
    a = lodash.cloneDeep(a);
    if(a.i !== b.i && a.st !== b.st && a.y[0] === b.y[0] && a.y[1] === b.y[1]) {
      i++;
      let x = (a.x + b.x) >> 1;
      let arr;
      if(yHash.has(a.x)) {
        arr = yHash.get(a.x);
      }
      else {
        arr = [];
        yHash.set(a.x, arr);
      }
      arr.push({
        x,
        y: a.y,
      });
      a.x = x;
      mergeVertical.push(a);
      let arr2;
      if(yHash.has(b.x)) {
        arr2 = yHash.get(b.x);
      }
      else {
        arr2 = [];
        yHash.set(b.x, arr2);
      }
      arr2.push({
        x,
        y: a.y,
      });
    }
    else {
      mergeVertical.push(a);
    }
  }
  mergeVertical.push(extendVertical[extendVertical.length - 1]);
  mergeHorizontal.forEach(item => {
    if(yHash.has(item.x[0])) {
      let arr = yHash.get(item.x[0]);
      for(let i = 0; i < arr.length; i++) {
        let o = arr[i];
        if(item.y >= o.y[0] && item.y <= o.y[1]) {
          item.x[0] = o.x;
          break;
        }
      }
    }
    if(yHash.has(item.x[1])) {
      let arr = yHash.get(item.x[1]);
      for(let i = 0; i < arr.length; i++) {
        let o = arr[i];
        if(item.y >= o.y[0] && item.y <= o.y[1]) {
          item.x[1] = o.x;
          break;
        }
      }
    }
  });
  mergeVertical.forEach(item => {
    if(xHash.has(item.y[0])) {
      let arr = xHash.get(item.y[0]);
      for(let i = 0; i < arr.length; i++) {
        let o = arr[i];
        if(item.x >= o.x[0] && item.x <= o.x[1]) {
          item.y[0] = o.y;
          break;
        }
      }
    }
    if(xHash.has(item.y[1])) {
      let arr = xHash.get(item.y[1]);
      for(let i = 0; i < arr.length; i++) {
        let o = arr[i];
        if(item.x >= o.x[0] && item.x <= o.x[1]) {
          item.y[1] = o.y;
          break;
        }
      }
    }
  });
  return {
    mergeHorizontal,
    mergeVertical,
  };
}

function getUnion(mergeHorizontal, mergeVertical, center) {
  let unionHorizontal = lodash.cloneDeep(mergeHorizontal);
  let unionVertical = lodash.cloneDeep(mergeVertical);
  let h = [];
  let v = [];
  let last = null;
  let temp = null;
  unionHorizontal.forEach(item => {
    if(last === null) {
      temp = [item];
    }
    else if(last.y !== item.y) {
      h.push(temp);
      temp = [item];
    }
    else {
      temp.push(item);
    }
    last = item;
  });
  h.push(temp);
  last = null;
  temp = null;
  unionVertical.forEach(item => {
    if(last === null) {
      temp = [item];
    }
    else if(last.x !== item.x) {
      v.push(temp);
      temp = [item];
    }
    else {
      temp.push(item);
    }
    last = item;
  });
  v.push(temp);
  for(let i = 0; i < unionHorizontal.length - 1; i++) {
    let a = unionHorizontal[i];
    for(let j = i + 1; j < unionHorizontal.length; j++) {
      let b = unionHorizontal[j];
      // 纵轴不相交跳过
      if(b.x[1] <= a.x[0] || b.x[0] >= a.x[1]) {
        continue;
      }
      // 遍历竖线，除边线外相交分割的尝试合并
      let list = [];
      unionVertical.forEach(l => {
        if(l.x >= a.x[0] && l.x >= b.x[0] && l.x <= a.x[1] && l.x <= b.x[1] && l.y[0] <= a.y && l.y[1] >= b.y) {
          list.push(l);
        }
      });
      for(let k = 0; k < list.length - 2; k++) {
        let c = list[k];
        let d = list[k + 1];
        let e = list[k + 2];
        let left = isEmpty(a.y, d.x, b.y, c.x, center);
        let right = isEmpty(a.y, e.x, b.y, d.x, center);
        if(left || right) {
          // 刚好高度相符分割取消此线
          if(d.y[0] === a.y && d.y[1] === b.y) {
            d.ignore = true;
            list.splice(k + 1, 1);
            k--;
          }
        }
      }
      // 提前跳出，因为a、b等长后续不会再有线段能和a组合成矩形
      if(b.x[0] === a.x[0] && b.x[1] === a.x[1]) {
        break;
      }
    }
  }
  for(let i = 0; i < unionVertical.length - 1; i++) {
    let a = unionVertical[i];
    for(let j = i + 1; j < unionVertical.length; j++) {
      let b = unionVertical[j];
      // 横轴不相交跳过
      if(b.y[1] <= a.y[0] || b.y[0] >= a.y[1]) {
        continue;
      }
      let list = [];
      unionHorizontal.forEach(l => {
        if(l.y >= a.y[0] && l.y >= b.y[0] && l.y <= a.y[1] && l.y <= b.y[1] && l.x[0] <= a.x && l.x[1] >= b.x) {
          list.push(l);
        }
      });
      for(let k = 0; k < list.length - 2; k++) {
        let c = list[k];
        let d = list[k + 1];
        let e = list[k + 2];
        let left = isEmpty(c.y, b.x, d.y, a.x, center);
        let right = isEmpty(d.y, b.x, e.y, a.x, center);
        if(left || right) {
          if(d.x[0] === a.x && d.x[1] === b.x) {
            d.ignore = true;
            list.splice(k + 1, 1);
            k--;
          }
        }
      }
      if(b.y[0] === a.y[0] && b.y[1] === a.y[1]) {
        break;
      }
    }
  }
  unionHorizontal = unionHorizontal.filter(item => {
    return !item.ignore;
  });
  unionVertical = unionVertical.filter(item => {
    return !item.ignore;
  });
  return {
    unionHorizontal,
    unionVertical,
  };
}

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

function isEmpty(top, right, bottom, left, center) {
  for(let i = 0; i < center.length; i++) {
    let item = center[i];
    if(item.x >= left && item.x <= right && item.y >= top && item.y <= bottom) {
      return false;
    }
  }
  return true;
}

export default function(json) {
  let { top, right, bottom, left, originHorizontal, originVertical } = getOrigin(json);
  let { extendHorizontal, extendVertical } = getExtend(top, right, bottom, left, originHorizontal, originVertical);
  let { mergeHorizontal, mergeVertical } = getMerge(extendHorizontal, extendVertical);
  let center = [];
  json.forEach(item => {
    center.push({
      x: item.xs + (item.width >> 1),
      y: item.ys + (item.height >> 1),
    });
  });
  let { unionHorizontal, unionVertical } = getUnion(mergeHorizontal, mergeVertical, center);
  return {
    originHorizontal,
    originVertical,
    extendHorizontal,
    extendVertical,
    mergeHorizontal,
    mergeVertical,
    center,
    unionHorizontal,
    unionVertical,
  };
}
