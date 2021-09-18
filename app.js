import { DisjointSet } from './DisjointSet';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const width = 8;
  const squares = [];
  let score = 0;
  let blankSquares = [];

  const scoreDisplay = document.getElementById('score');

  const colors = ['red', 'yellow', 'blue', 'purple', 'green', 'orange'];

  getRandomColor = () => {
    return colors[Math.floor(Math.random()*colors.length)]; 
  }
  
  //create the randomly colored squares
  createBoard = () => {
    for(let i = 0; i < width**2; i++) {
      
      //create new div with random color and save as square
      const square = document.createElement('div');
      square.style.backgroundColor = getRandomColor();
      //make square draggable and set its id to current i
      square.setAttribute('draggable', true);
      square.setAttribute('id', i);
      grid.appendChild(square);

      //add the square to the squares array, index will be id
      squares.push(square);
    }
  }
  createBoard();
  

  //set up the dragging of the squares
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach(square => square.addEventListener('dragstart', dragStart));
  squares.forEach(square => square.addEventListener('dragend', dragEnd));
  squares.forEach(square => square.addEventListener('dragover', dragOver));
  squares.forEach(square => square.addEventListener('dragenter', dragEnter));
  squares.forEach(square => square.addEventListener('dragleave', dragLeave));
  squares.forEach(square => square.addEventListener('drop', dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundColor;
    squareIdBeingDragged = parseInt(this.id);
    console.log(squareIdBeingDragged);
    console.log(this.id, 'dragstart');
  }

  //define valid moves here
  function dragEnd() {
    //TODO: update this to correct swapping logic
    console.log(this.id, 'dragend');
    let validMoves = [squareIdBeingDragged - 1,
                      squareIdBeingDragged - width,
                      squareIdBeingDragged + 1,
                      squareIdBeingDragged + width];
    let validMove = validMoves.includes(squareIdBeingReplaced);
    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    }
  }

  function dragOver(event) {
    event.preventDefault();
    console.log(this.id, 'dragover');
  }

  function dragEnter(event) {
    event.preventDefault();
    console.log(this.id, 'dragenter');
  }

  function dragLeave(event) {
    event.preventDefault();
    console.log(this.id, 'dragleave');
  }

  function dragDrop(event) {
    event.preventDefault();
    console.log(this.id, 'dragdrop');
    colorBeingReplaced = this.style.backgroundColor;
    squareIdBeingReplaced = parseInt(this.id);
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    this.style.backgroundColor = colorBeingDragged;
  }

  //check for valid submit group
  checkRowForFour = () => {
    //TODO: add code for getting group size and add valid scoring logic here
    //Look in the superball lab write-up to get the logic needed

    //This is test logic used for candycrush
    for (let i = 0; i < 61; i++) {
      let rowOfFour = [i, i+1, i+2, i+3];
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === '';
      
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55];
      if (notValid.includes(i)) continue

      if (rowOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach(index => {
          squares[index].style.backgroundColor = '';
          blankSquares.push(squares[index]);
        });
      }
    }
  }
  checkRowForFour();

  checkColForFour = () => {
    //TODO: update this and combine with checkRowForThree using Graph algos
    for (let i = width*3; i < width**2; i++) {
      let colOfFour = [i, i-width, i-width*2, i-width*3];
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === '';
      
      if (colOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
        score += 4;
        scoreDisplay.innerHTML = score
        colOfFour.forEach(index => {
          squares[index].style.backgroundColor = '';
          blankSquares.push(squares[index]);
        });
      }
    }
  }
  checkColForFour();

  moveDown = () => {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundColor === '') {
        squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
        squares[i].style.backgroundColor='';
        const firstRow = [0,1,2,3,4,5,6,7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundColor === '') {
          squares[i].style.backgroundColor = getRandomColor();
        }
      }
    }
  }

  //check for three automatically on interval every second
   window.setInterval(function(){
     checkRowForFour();
     checkColForFour();
     moveDown();
   }, 100);

})