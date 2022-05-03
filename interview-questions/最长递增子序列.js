// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// 直接遍历元素 如果比当前的末尾大直接追加
// 如果比末尾小 这个数值更有潜力 就替换 找到当前序列比这个元素大的值替换
function getSequence(arr) {
  const p = arr.slice() // 记录前驱节点索引
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      // 二分查找
      u = 0 // 开始
      v = result.length - 1 // 结束
      while (u < v) {
        c = (u + v) >> 1 // 中间值
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  // 前驱节点逆序追溯
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
