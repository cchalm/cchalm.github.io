Array.prototype.clone = function() {
  return this.slice(0);
}

function gtdRock() {
  // Right now just an empty object
}

function gtdSpace() {
  this.blocked = false;
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

  for (var y = 0; y < this.height; y++) {
    grid.push([]);
    for (var x = 0; x < this.width; x++) {
      grid[y].push(null);
    }
  }

  for (var y = 0; y < this.height - 1; y++) {
    spaces.push([]);
    for (var x = 0; x < this.width - 1; x++) {
      spaces[y].push(new gtdSpace());
    }
  }

  this.grid = grid;
  this.spaces = spaces;
}

// Returns the spaces adjacent to the passed grid coordinates as a four-element
// array. The spaces are ordered [TL, TR, BL, BR], where top left (TL) is the
// space with diagonal corners (gridX - 1, gridY - 1) and (gridX, gridY). Spaces
// outside the bounds of the grid will appear in the returned array as undefined.
// The returned array contains gtdSpace objects that are directly connected to
// the state of this gtdGrid - modifying them modifies the grid, and if the grid
// is modified externally these objects will reflect those changes.
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
    if (adjSpaces[i].val) {
      blocked = true;
    }
  }

  if (!blocked) {
    // The spaces around this grid spot are not blocked! Place the rock.
    grid[gridY][gridX] = new gtdRock();

    // Block adjacent spaces. Because getAdjacentSpaces() returns reference
    // types, we can modify the underlying array through them.
    for (var i = 0; i < adjSpaces.length(); i++) {
      adjSpaces[i].val = true;
    }

    // Return true, indicating a rock was successfully added.
    return true;
  } else {
    // The spaces around this grid position are blocked, we cannot place a rock
    // here. Return false, indicating a rock could not be added.
    return false;
  }
}

function test() {
  document.getElementById("testTextElement").innerHTML = "oh. wow. javascript.";
}

window.onload = function() {
  document.getElementById("testButton").onclick = test;
}
