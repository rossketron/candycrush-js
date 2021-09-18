// ========================= Define DisjointSet Class =========================
class DisjointSet {
  // Create a new Disjoint Set and init all property vals
  constructor(numElements) {
      if (numElements > 0) {

        this.size = numElements;
        this.links = [];
        this.ranks = [];
        this.sizes = [];
        this.elements = [];
        this.setIds = [];
        this.setIdIndices = [];

        for (let i = 0; i < numElements; i++) {
          this.links.push(-1);
          this.ranks.push(1);
          this.sizes.push(1);
          this.elements.push([]);
          this.setIds.push(i);
          this.setIdIndices.push(i);
          this.elements[i].push(i);
        } 
      }
  }

  // Perform a union of two distinct sets
  union = (set1, set2) => {
    let parent, child;
    let last;

    // verify valid params 
    if (this.links.length == 0) {
      console.log("DisjointSet: Union called on an unitialized DisjointSet.");
      // continue;
    }
    if (set1 < 0 || set1 >= this.links.length || set2 < 0 || set2 >= this.links.length) {
      console.log("DisjointSet: Union called on a bad element (negative or too big");
      // continue;
    }
    if (this.links[set1] !== -1 || this.links[set2] !== -1) {
      console.log("DisjoinSet: Union called on a set, not just an element");
      // continue;
    }
    
    // check rands of each set to determine which will acquire the other (parent v. child)
    if (this.ranks[set1] > this.ranks[set2]) {
      parent = set1;
      child = set2;
    } else {
      parent = set2;
      child = set1;
    }

    // point child's link to the parent set
    // if this changes the parent's rank, increment the parent rank
    this.links[child] = parent;
    if (this.ranks[parent] == this.ranks[child]) {
      this.ranks[parent] += 1;
    }

    // update parent's size to include the child set
    // and move the child set to the beginning of the parent set's elements
    this.sizes[parent] += this.sizes[child];
    this.elements[parent].splice(0, 0, this.elements[child]);

    // remove child set from setIDs by replacing it with the last element
    // and then delete the last element
    last = this.setIds[this.setIds.length - 1];
    this.setIdIndices[last] = this.setIdIndices[child];
    this.setIds[this.setIdIndices[last]] = last;
    this.setIds.pop();
    console.log('preUnion:', set1, set2);
    return parent;
  }

  // find the parent set of an element
  find = (element) => {
    let parent, child;
    
    // verify valid element param
    if (this.links.length == 0) {
      console.log("DisjointSet: find called on unitilized DisjointSet");
      // continue;
    }
    if (element < 0 || element >= this.links.length) {
      console.log("DisjointSet: find called on bad element (negative or too big)");
      // continue;
    }

    // find the root of the tree, setting parents' links to children along the way
    child = -1;
    while (this.links[element] != -1) {
      parent = this.links[element];
      links[element] = child;
      child = element;
      element = parent;
    }

    // traverse back to original element, setting links to root of tree
    parent = element;
    element = child;
    while (element != -1) {
      child = this.links[element];
      this.links[element] = parent;
      element = child;
    }

    return parent;
  }
}
// ============================================================================

// =================== Begin Game Logic and DOM interaction ===================
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
  
  // Create the grid with randomly colored squares
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

    // create a DisjointSet with each square representing its own set
  }
  createBoard();
  let disjointSet = new DisjointSet(squares.length);
  console.log('DisjointSet Size:', disjointSet.size);
  console.log('DisjointSet Links:', disjointSet.links);
  

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
  }

  //check for valid submit group
  checkRowForFour = () => {
    //TODO: add code for getting group size and add valid scoring logic here
    //Use the DisjointSet logic to keep group size. This is more in line with Superball.
    //Change from candycrush base logic to Superball defined here -> 
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
     moveDown();
   }, 100);

})
// ============================================================================
