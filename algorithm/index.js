// 二分查找法
function binarySearch(s, arr, start, end) {
  if (start > end) return -1
  let mid = Math.floor((start + end) / 2)
  if (s === arr[mid]) {
    return mid
  } else if (s > arr[mid]) {
    return binarySearch(s, arr, mid, end)
  } else {
    return binarySearch(s, arr, start, mid)
  }
}

export { binarySearch }
