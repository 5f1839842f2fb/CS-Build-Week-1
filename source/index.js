
class cell {
  constructor(xcoord, ycoord) {
    this.x = xcoord
    this.y = ycoord
    this.state = Math.round(Math.random() - .40) //adjusting the constant being subtracted raises or lowers the amount of initial live cells
  }
  
  checkNeighbours() {
    const neighbours = []
    neighbours.push(getByCoord(this.x-1, this.y-1)) // nw
    neighbours.push(getByCoord(this.x, this.y-1)) // n
    neighbours.push(getByCoord(this.x+1, this.y-1)) // ne
    neighbours.push(getByCoord(this.x-1, this.y)) // w
    neighbours.push(getByCoord(this.x+1, this.y)) // e
    neighbours.push(getByCoord(this.x-1, this.y+1)) // sw
    neighbours.push(getByCoord(this.x, this.y+1)) // w
    neighbours.push(getByCoord(this.x+1, this.y+1)) // se
    
    /* console.log(neighbours) */

    var total = 0
    neighbours.forEach(element => {
      if(element !== undefined) {
        total += element.state
      }
    })
    return total
  }

  liveOrDie() {
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

function getByCoord(x, y) {
  return grid[x+y*64]
}

const WIDTH = 512
const LENGTH = 512

var grid = []
play = false

const canvas = document.querySelector("canvas"); //set up canvas context
const context = canvas.getContext("2d");

context.fillRect(0, 0, WIDTH, LENGTH) // this and the following set up black grid lines

context.fillStyle = 'white'
  for (i = 0; i < WIDTH/8; i++) {
    for (j = 0; j < LENGTH/8; j++) {
      context.fillRect(i*9, j*9, 8, 8)
    }
  }

function generate() {
  grid = []
  for (i = 0; i < WIDTH/8; i++) { // populate the grid array with new cell objects
    for (j = 0; j < LENGTH/8; j++) {
      cell1 = new cell(j, i)
      grid.push(cell1)
    }
  }
  renderGrid()
}

function renderGrid() {
  grid.forEach(element => {
    if(element.state == 1) {
      context.fillStyle = 'black'
    } else {
      context.fillStyle = 'white'
    }
    context.fillRect(element.x*9, element.y*9, 8, 8)
  })
}

function iterate() {
  newgrid = []
  grid.forEach(element => {
    cell1 = new cell(element.x, element.y)
    cell1.state = element.liveOrDie()
    newgrid.push(cell1)
  })
  grid = newgrid
  renderGrid()
}

function autoplay(play) {
  play = setInterval(()=> {
    iterate()
  }, 1000)
}

function stopplaying(play) {
  clearTimeout(play)
}

function startstop() {
  if (play == false) {
    console.log('playing')
    play = setInterval(()=> {
      iterate()
    }, 1000)
  } else {
    console.log('stopping')
    clearTimeout(play)
    play = false
  }
}
window.onload = generate;
const start = document.getElementById("startbutton")
start.onclick = startstop
const restart = document.getElementById("reset")
restart.onclick = generate