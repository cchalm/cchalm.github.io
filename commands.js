"use strict";

let commands = Object.freeze({
  STEP: "step",
  LEFT: "left",
  RIGHT: "right"
});

let orientals = Object.freeze({
  NORTH: "north",
  EAST: "east",
  SOUTH: "south",
  WEST: "west"
});

let player = {
  x: 4,
  y: 4,
  oriental: orientals.NORTH,

  isAt: function(x, y) {
    return x === this.x && y === this.y;
  }
};

let grid = {};

window.onload = function() {
  let thisScript = document.getElementsByTagName("script")[0];
  thisScript.parentNode.removeChild(thisScript);

  initGrid(9, 9);

  grid.addBlockAt(5, 5);

  document.getElementById("run-btn").onclick = run;

  show();
}

function run() {
  let cmds;
  
  try {
    cmds = parseCommands(document.getElementById("commandInput").value);
  } catch (e) {
    document.getElementById("errors").innerText = e;
    return;
  }

  document.getElementById("run-btn").disabled = true;

  runHelper(cmds);
}

function runHelper(cmds) {
  let cmd = cmds.shift();
  console.log(cmd);

  switch (cmd) {
    case commands.STEP:
      let newPos = { x: player.x, y: player.y };

      switch (player.oriental) {
        case orientals.NORTH:
          newPos.y -= 1;
          break;
        case orientals.EAST:
          newPos.x += 1;
          break;
        case orientals.SOUTH:
          newPos.y += 1;
          break;
        case orientals.WEST:
          newPos.x -= 1;
          break;
      }

      if (grid.contains(newPos.x, newPos.y)
          && !grid.hasBlockAt(newPos.x, newPos.y)) {
        player.x = newPos.x;
        player.y = newPos.y;
      }

      break;
    case commands.RIGHT:
      switch (player.oriental) {
        case orientals.NORTH:
          player.oriental = orientals.EAST;
          break;
        case orientals.EAST:
          player.oriental = orientals.SOUTH;
          break;
        case orientals.SOUTH:
          player.oriental = orientals.WEST;
          break;
        case orientals.WEST:
          player.oriental = orientals.NORTH;
          break;
      }        
      break;
    case commands.LEFT:

      switch (player.oriental) {
        case orientals.NORTH:
          player.oriental = orientals.WEST;
          break;
        case orientals.EAST:
          player.oriental = orientals.NORTH;
          break;
        case orientals.SOUTH:
          player.oriental = orientals.EAST;
          break;
        case orientals.WEST:
          player.oriental = orientals.SOUTH;
          break;
      }        

      break;
  }

  show();

  if (cmds.length === 0) {
    document.getElementById("run-btn").disabled = false;
    return;
  }

  window.setTimeout(runHelper(cmds), 700);
}

function parseCommands(inputText) {
  let cmds = [];
  let errs = [];

  let lines = inputText.split('\n'); 
  for (let line of lines) {
    line = line.replace(/\s/g, "");

    if (line.length === 0)
      continue;

    switch (line.toLowerCase()) {
      case commands.STEP:
        cmds.push(commands.STEP);
        break;
      case commands.LEFT:
        cmds.push(commands.LEFT);
        break;
      case commands.RIGHT:
        cmds.push(commands.RIGHT);
        break;
      default:
        errs.push(line);
    }
  }

  if (errs.length !== 0) {
    let errStr = "Invalid command(s):";
    for (let err of errs) {
      errStr += " " + err;
    }

    throw errStr;
  }

  return cmds;
}

function initGrid(width, height) {
  grid.width = width;
  grid.height = height;
  // Maps x-coordinates to sets of y-coordinates
  grid.blocks = {};

  grid.hasBlockAt = function(x, y) {
    return hasKey(this.blocks, x) && this.blocks[x].has(y);
  };

  grid.addBlockAt = function(x, y) {
    assert(this.contains(x, y), "Coordinates out of bounds");

    if (!hasKey(this.blocks, x))
      this.blocks[x] = new Set();

    let ys = this.blocks[x];

    if (!ys.has(y))
      ys.add(y);
  }

  grid.removeBlockAt = function(x, y) {
    assert(this.contains(x, y), "Coordinates out of bounds");

    if (this.hasBlockAt(x, y)) {
      this.blocks[x].delete(y);
      if (this.blocks[x].size === 0)
        delete this.blocks[x];
      return true;
    } else {
      return false;
    }
  }

  grid.contains = function(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}

function show() {
  let table = document.getElementById("grid");
  table.innerHTML = "";

  let row = document.createElement("tr");
  let col = document.createElement("td");

  let div = document.createElement("div");
  col.appendChild(div);

  for (let rowNum = 0; rowNum < grid.height; rowNum++) {
    let row = document.createElement("tr");

    for (let colNum = 0; colNum < grid.width; colNum++) {
      let col = document.createElement("td");

      col.id = "" + colNum + "," + rowNum;
      col.className = "grid-square";

      if (grid.hasBlockAt(colNum, rowNum)) {
        col.className += " block";
      }

      if (player.isAt(colNum, rowNum)) {
        col.className += " player-" + player.oriental;
      }

      row.appendChild(col);
    }

    table.appendChild(row);
  }
}

function hasKey(dict, key) {
  return Object.prototype.hasOwnProperty.call(dict, key);  
}

function assert(condition, message) {
  if (!condition) {
    message = message || "Assertion failed";
    throw new Error(message);
  }
}
