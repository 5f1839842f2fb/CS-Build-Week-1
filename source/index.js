
class Cell {
  constructor(xcoord, ycoord) {
    this.x = xcoord
    this.y = ycoord
    this.state = Math.round(Math.random() - .35)  //adjusting the constant being subtracted raises or lowers the amount of initial live cells
  }

  checkNeighbours() {  // returns the total number of neighbour cells that are alive
    const neighbours = []
    neighbours.push(getByCoord(this.x - 1, this.y - 1)) // nw
    neighbours.push(getByCoord(this.x, this.y - 1)) // n
    neighbours.push(getByCoord(this.x + 1, this.y - 1)) // ne
    neighbours.push(getByCoord(this.x - 1, this.y)) // w
    neighbours.push(getByCoord(this.x + 1, this.y)) // e
    neighbours.push(getByCoord(this.x - 1, this.y + 1)) // sw
    neighbours.push(getByCoord(this.x, this.y + 1)) // w
    neighbours.push(getByCoord(this.x + 1, this.y + 1)) // se

    /* console.log(neighbours) */

    var total = 0
    neighbours.forEach(element => {
      if (element !== undefined) {
        total += element.state
      }
    })
    return total
  }

  liveOrDie() {  // changes cell state depending on number of alive neighbour cells
    const n = this.checkNeighbours()
    if (this.state == 1) {
      if (n < 2) {
        return 0
      }
      if (n > 3) {
        return 0
      }
      return 1
    } else {
      if (n == 3) {
        return 1
      }
      return 0
    }
  }
}

function toggle(xcoord, ycoord) {  // toggles a cell's state given its coordinates
  console.log(xcoord, ycoord)
  cell = getByCoord(xcoord, ycoord)
  cell.state = !cell.state
  renderGrid()
}

function getByCoord(x, y) {
  return grid[x + y * (WIDTH / 8)]
}

var WIDTH = 800
var LENGTH = 800

var grid = []
var isPlaying = false
var play = false
var interval = 1000
var genNum = 0

const canvas = document.querySelector("canvas"); //set up canvas context
const context = canvas.getContext("2d");
canvas.width = WIDTH
canvas.height = LENGTH

context.fillRect(0, 0, WIDTH, LENGTH) // this and the following set up black grid lines

context.fillStyle = 'white'
for (i = 0; i < WIDTH / 8; i++) {
  for (j = 0; j < LENGTH / 8; j++) {
    context.fillRect(i * 9, j * 9, 8, 8)
  }
}

function generate() {
  grid = []
  for (i = 0; i < WIDTH / 8; i++) { // populate the grid array with new cell objects
    for (j = 0; j < LENGTH / 8; j++) {
      cell = new Cell(j, i)
      grid.push(cell)
    }
  }
  genNum = 0
  generation.innerText = `Generation: ${genNum}`
  renderGrid()
}

function renderGrid() {
  grid.forEach(element => {
    if (element.state == 1) {
      context.fillStyle = 'black'
    } else {
      context.fillStyle = 'white'
    }
    context.fillRect(element.x * 9, element.y * 9, 8, 8)
  })
}

function iterate() {  // makes a new grid state and fills it with the outcomes of each cell calculating whether to live or die, then replaces the old grid with the new one
  newgrid = []
  grid.forEach(element => {
    cell = new Cell(element.x, element.y)
    cell.state = element.liveOrDie()
    newgrid.push(cell)
  })
  grid = newgrid
  genNum += 1
  generation.innerText = `Generation: ${genNum}`
  renderGrid()
}

function startstop() {  // toggles the auto-stepping
  if (isPlaying == false) {
    isPlaying = true
    console.log('playing')
    play = setInterval(() => {
      iterate()
    }, interval)
  } else {
    console.log('stopping')
    clearTimeout(play)
    isPlaying = false
  }
}

window.onload = generate;

const start = document.getElementById("startbutton")  // button and input stuff
start.onclick = startstop

const restart = document.getElementById("reset")
restart.onclick = () => {
  isPlaying = true
  startstop()
  generate()
}

const clear = document.getElementById("clear")
clear.onclick = () => {
  grid.forEach(element => {
    element.state = 0
  })
  renderGrid()
}

canvas.onclick = e => {
  toggle(Math.floor(e.offsetX / 9), Math.floor(e.offsetY / 9))
}

const generation = document.getElementById("generation")
const speed = document.getElementById("speed")
speed.onchange = e => {
  interval = e.target.value
}

const size = document.getElementById("size")
size.onchange = e => { 
  WIDTH = e.target.value
  LENGTH = e.target.value
  canvas.width = WIDTH
  canvas.height = LENGTH

  context.fillRect(0, 0, WIDTH, LENGTH) 
  context.fillStyle = 'white'
  for (i = 0; i < WIDTH / 8; i++) {
    for (j = 0; j < LENGTH / 8; j++) {
      context.fillRect(i * 9, j * 9, 8, 8)
    }
  }
  generate()
}