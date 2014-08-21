Array.prototype.clone = function() {
  return this.slice(0);
}

function gtdRock() {
  // Right now just an empty object
}

function gtdGrid(width, height) {
  this.width = width;
  this.height = height;

  this.grid;
  this.spaces;

  this.empty() 
}

// Initialize or re-initialize the grid to be empty.
gtdGrid.prototype.empty() {
  var grid = [];
  var spaces = [];

  // Empty rows that we will copy to create each row of the grid and spaces
  // arrays.
  var emptyGridRow = [];
  var emptySpacesRow = [];

  // Use width - 1 because the grid of spaces has one less column than the grid
  // itself.
  for (var x = 0; x < this.width - 1; x++) {
    emptyGridRow.push(null);
    emptySpacesRow.push(false);
  }
  // Add the final grid column
  emptyGridRow.push(null);

  // Use height - 1 because the grid of spaces has one less row than the grid
  // itself.
  for (var y = 0; x < this.height - 1; x++) {
    grid.push(emptyGridRow.clone());
    spaces.push(emptySpacesRow.clone());
  }
  // Add the final grid row
  grid.push(emptyGridRow.clone());

  this.grid = grid;
  this.spaces = spaces;
}

// Returns a two-dimensional array of booleans representing the spaces between
// gridlines. In the array, falses mean a space is unoccupied, while trues mean
// a space is occupied. The returned array is independent of this gtdGrid.
gtdGrid.prototype.getSpaces() {
  return spaces.clone()
}

gtdGrid.prototype.getAdjacentSpacesRef(gridX, gridY) {
  
}

// Returns the spaces adjacent to the passed grid coordinates as a four-element
// array. The spaces are ordered [TL, TR, BL, BR], where top left (TL) refers to
// the space above and to the left of (gridX, gridY), assuming a coordinate
// system with (0, 0) at the top left. In other words, TL is the space with
// diagonal corners (gridX - 1, gridY - 1) and (gridX, gridY). Spaces outside
// the bounds of the grid will appear in the returned array as undefined. The
// returned array is independent of the spaces array.
gtdGrid.prototype.getAdjacentSpaces(gridX, gridY) {
  var adjSpaces = [];
  
  adjSpaces.push(spaces[gridY - 1][gridX - 1]);
  adjSpaces.push(spaces[gridY - 1][gridX]);
  adjSpaces.push(spaces[gridY][gridX - 1]);
  adjSpaces.push(spaces[gridY][gridX]);

  return adjSpaces;
}

// Adds a rock at the passed grid location. The rock occupies the spaces adjacent
// to its location. Returns true if the rock was successfully placed, false
// otherwise - if another rock was blocking the adjacent spaces, for example.
gtdGrid.prototype.addRock(gridX, gridY) {
  var blocked = false;
  var adjSpaces = this.getAdjacentSpaces(gridX, gridY);
  
  for (var i = 0; i < adjSpaces.length(); i++) {
    if (adjSpaces[i]) {
      blocked = true;
    }
  }

  if (!blocked) {
    grid[gridY][gridX] = new gtdRock();

    // Mark adjacent spaces
    // TODO change getAdjacentSpaces to return references
    spaces[gridY - 1][gridX - 1] = true;
    spaces[gridY - 1][gridX] = true;
    spaces[gridY][gridX - 1] = true;
    spaces[gridY][gridX] = true;

    return true;
  } else {
    return false;
  }
}

function test() {
  document.getElementById("testTextElement").innerHTML = "oh. wow. javascript.";
}

window.onload = function() {
  document.getElementById("testButton").onclick = test;
}
