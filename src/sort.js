function quickSort(arr, begin, end, compare) {
  if(begin >= end) {
    return;
  }
  var i = begin, j = end, p = i, v = arr[p], seq = true;
  while(i < j) {
    if(seq) {
      for(; i < j; j--) {
        if(compare.call(arr, v, arr[j])) {
          swap(arr, p, j);
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
          swap(arr, p, i);
          p = i;
          seq = !seq;
          j--;
          break;
        }
      }
    }
  }
  quickSort(arr, begin, p - 1, compare);
  quickSort(arr, p + 1, end, compare);
}
function swap(arr, a, b) {
  var temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

export default function(arr, compare, start = 0, end = arr.length - 1) {
  if(!Array.isArray(arr)) {
    throw new Error('quick sort need an array');
  }
  if(arr.length < 2 || start <= end || start < 0 || end >= arr.length) {
    return arr;
  }
  compare = compare || function() {};
  quickSort(arr, start, end, compare);
  return arr;
};
