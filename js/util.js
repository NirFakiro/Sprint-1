'use strict'

function createMat(ROWS, COLS) {
  const mat = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}

// get random num from arry without repeat the same num
var gSize = 4
var gNums = creatNums()

function creatNums() {
  var nums = []
  for (var i = 0; i <= gSize; i++) {
    nums.push(i)
  }
  var i = nums.length,
    j,
    temp
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1))
    temp = nums[j]
    nums[j] = nums[i]
    nums[i] = temp
  }
  return nums
}

function getNum(nums) {
  return nums.pop()
}
///////////////////////////////////
