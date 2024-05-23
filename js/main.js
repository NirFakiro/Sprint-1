'use stict'

const MINE = '🧨'
const FLAG = '🚩'
const EMPTY = ''
var countFlag = 0
var touchingMine = false

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
}
var gBoard = {
  minesAroundCount: 0,
  isShow: false,
  isMine: false,
  isMarked: false,
}

var gLevel = {
  size: 8,
  mines: 6,
}

var gameBoard

function onInit() {
  gGame.secsPassed = 0
  gameBoard = createBoard()
  setMInesNegsCount(gameBoard)
  renderBoard(gameBoard)
  closeModal()
}

function createBoard() {
  const board = []
  for (var i = 0; i < gLevel.size; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShow: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  addMines(board, gLevel.mines)
  console.log('board:', board)

  return board
}

function renderBoard(board) {
  strHTML = ''
  var length = gLevel.size
  for (var i = 0; i < length; i++) {
    strHTML += `<tr>`
    for (var j = 0; j < length; j++) {
      const cell = board[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellRightClicked(event,this, ${i},${j})" class="${className}">${
        !cell.isShow ? '' : cell.minesAroundCount
      }</td>`
    }
    strHTML += `</tr>`
  }
  const elContainer = document.querySelector('.board')
  elContainer.innerHTML = strHTML
}

function setMInesNegsCount(board) {
  var size = gameBoard.length
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var mineCount = 0

      // neg cells
      for (var si = i - 1; si <= i + 1; si++) {
        for (var sj = j - 1; sj <= j + 1; sj++) {
          if (si >= 0 && si < size && sj >= 0 && sj < size) {
            if (si !== i || sj !== j) {
              if (board[si][sj].isMine) {
                mineCount++
              }
            }
          }
        }
      }
      board[i][j].minesAroundCount = mineCount
    }
  }
  return mineCount
}

function onCellClicked(elCell, rowIdx, colIdx) {
  var currCell = gameBoard[rowIdx][colIdx]
  if (!currCell.isShow) {
    expandShown(gameBoard, rowIdx, colIdx)

    // Update Modal
    gameBoard[rowIdx][colIdx].isShow = true
    gGame.shownCount++
    gGame.secsPassed++
    currCell.isShow = true

    // Update Dom
    elCell.innerText = gameBoard[rowIdx][colIdx].minesAroundCount
    elCell.style.backgroundColor = '#868e96'
  }

  // Check victory
  var countCell = gLevel.size ** 2
  var minesNum = gLevel.mines
  var secsPassed = gGame.secsPassed
  var diff = countCell - minesNum

  if (secsPassed >= diff) {
    console.log('secsPassed:', secsPassed)
    gameOver()
  }
  if (currCell.isMine) {
    elCell.innerText = MINE
    touchingMine = true
    gameOver()
  }
}

function onCellRightClicked(event, elCell, i, j) {
  event.preventDefault()
  //Update Modal
  gameBoard[i][j].isMarked = true

  //Update DOM
  elCell.innerText = FLAG
  countFlag++
}

function addMines(board, numMines) {
  for (var i = 0; i < numMines; i++) {
    const emptyLocation = getEmptyLocation(board)
    console.log('Mines location:', emptyLocation)

    board[emptyLocation.i][emptyLocation.j].isMine = true
  }
}

function getEmptyLocation(board) {
  const emptyLocations = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const currCell = board[i][j]

      if (currCell.isMine === false) {
        emptyLocations.push({ i, j })
      }
    }
  }

  if (!emptyLocations.length) return null

  const randomIdx = getRandomInt(0, emptyLocations.length - 1)
  return emptyLocations[randomIdx]
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function gameOver() {
  console.log('Game Over')
  var msg = touchingMine ? 'Game Over' : 'you won!'
  openModal(msg)
}

function openModal(msg) {
  const elModal = document.querySelector('.modal')
  const elMsg = elModal.querySelector('.msg')
  elMsg.innerText = msg
  elModal.style.display = 'block'
}

function closeModal() {
  const elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}

function expandShown(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board.length) continue
      if (i === rowIdx && j === colIdx) continue
      var cell = board[i][j]
      var cellElement = document.querySelector(`.cell-${i}-${j}`)

      if (!cell.isShow && cell.minesAroundCount === 0 && !cell.isMine) {
        // Update Modal
        gGame.shownCount++
        gGame.secsPassed++
        cell.isShow = true

        // Update DOM
        cellElement.innerText = cell.minesAroundCount
        cellElement.style.backgroundColor = '#868e96'
      }
    }
  }
}
