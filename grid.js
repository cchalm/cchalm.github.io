"use strict";

let orientals = Object.freeze({
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west"
});


let grid = {
  hasBlockAt: function(x, y) {
    return hasKey(this.blocks, x) && this.blocks[x].has(y);
  },

  addBlockAt: function(x, y) {
    assert(this.contains(x, y), "Coordinates out of bounds");

    if (!hasKey(this.blocks, x))
      this.blocks[x] = new Set();

    let ys = this.blocks[x];

    if (!ys.has(y))
      ys.add(y);
  },

  removeBlockAt: function(x, y) {
    assert(this.contains(x, y), "Coordinates out of bounds");

    if (this.hasBlockAt(x, y)) {
      this.blocks[x].delete(y);
      if (this.blocks[x].size === 0)
        delete this.blocks[x];
      return true;
    } else {
      return false;
    }
  },

  contains: function(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  },

  getBlocks: function() {
    let blocks = [];

    for (key in blocks) {
      for (val of blocks[key]) {
        blocks.push({ x: key, y: val });
      }
    }

    return blocks;
  }
};

function initGrid(width, height) {
  grid.width = width;
  grid.height = height;
  // Maps x-coordinates to sets of y-coordinates
  grid.blocks = {};
}

let target = {
  x: 0,
  y: 0,

  setPos: function(x, y) {
    if (grid.contains(x, y)) {
      this.x = x;
      this.y = y;
    }
  },

  isAt: function(x, y) {
    console.log(x);
    console.log(y);
    console.log(this.x);
    console.log(this.y);
    return x === this.x && y === this.y;
  }
};

let player = {
  x: 0,
  y: 0,
  oriental: orientals.NORTH,

  setPos: function(x, y) {
    if (grid.contains(x, y)) {
      this.x = x;
      this.y = y;
    }
  },

  isAt: function(x, y) {
    return x === this.x && y === this.y;
  }
};
