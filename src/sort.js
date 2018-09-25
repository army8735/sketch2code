function quickSort(arr, compare, begin, end) {
  if(begin >= end) {
    return;
  }
  var i = begin, j = end, p = i, v = arr[p], seq = true;
  while(i < j) {
    if(seq) {
      for(; i < j; j--) {
        if(compare.call(arr, v, arr[j])) {
          [arr[p], arr[j]] = [arr[j], arr[p]];
          p = j;
          seq = !seq;
          i++;
          break;
        }
      }
    }
    else {
      for(; i < j; i++) {
        if(compare.call(arr, arr[i], v)) {
          [arr[p], arr[j]] = [arr[j], arr[p]];
          p = i;
          seq = !seq;
          j--;
          break;
        }
      }
    }
  }
  quickSort(arr, compare, begin, p - 1);
  quickSort(arr, compare, p + 1, end);
}

export default function(arr, compare, start = 0, end = arr.length - 1) {
  if(!Array.isArray(arr)) {
    throw new Error('quick sort need an array');
  }
  if(arr.length < 2) {
    return arr;
  }
  compare = compare || function() {};
  quickSort(arr, compare, start, end);
  return arr;
};
