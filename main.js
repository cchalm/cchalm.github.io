"use strict";

function loadScript(filename) {
  return new Promise(function(resolve, reject) {
    let script = document.createElement("script");
    script.src = filename;

    script.onload = function() {
      this.parentNode.removeChild(this);
      resolve();
    }

    document.head.appendChild(script);
  });
}

window.onload = function() {
  let thisScript = document.getElementsByTagName("script")[0];
  thisScript.parentNode.removeChild(thisScript);

  loadScript("utils.js").then(function() {
    return loadScript("grid.js");
  }).then(function() {
    return loadScript("commands.js");
  }).then(function() {
    initGrid(9, 9);

    target.x = -1;
    target.y = -1;
    player.setPos(0, 8);

    initGridUI();

    document.getElementById("reset-btn").onclick = function() {
      // TODO complete hack
      reset = true;
      window.setTimeout(function() {
        reset = false;
        player.setPos(0, 8);
        player.oriental = orientals.NORTH;
        updateGridUI();
      }, 300);
    };
    document.getElementById("run-btn").onclick = run;

    let addingBlocks = false;
    let mouseDown = false;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {

        let elem = document.getElementById("" + x + "," + y);

        elem.onmousedown = function() {
          if (player.isAt(x, y))
            return;

          if (grid.hasBlockAt(x, y)) {
            grid.removeBlockAt(x, y);
            addingBlocks = false;
          } else {
            grid.addBlockAt(x, y);
            addingBlocks = true;
          }

          mouseDown = true;
          updateGridUI();
        }
/*
        elem.onmousemove = function() {
          if (mouseDown && (addingBlocks !== grid.hasBlockAt(x, y))) {
            if (addingBlocks)
              grid.addBlockAt(x, y);
            else
              grid.removeBlockAt(x, y);
            updateGridUI();
          }
        }
*/
        document.body.onmouseup = function() {
          mouseDown = false;
        }

      }
    }
  });
}

function initGridUI() {
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

      row.appendChild(col);
    }

    table.appendChild(row);
  }

  updateGridUI();
}

function updateGridUI(blocked) {
  blocked = typeof blocked === "undefined" ? false : blocked;

  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      let cell = getGridCell(x, y);
      cell.className = "grid-cell";

      if (grid.hasBlockAt(x, y)) {
        cell.className += " block";
      }

      if (player.isAt(x, y)) {
        cell.className += " player-" + player.oriental;
      } 

      if (target.isAt(x, y)) {
        cell.className += " target";
      }
    }
  }

  if (blocked) {
    let cell = getGridCell(player.x, player.y);

    cell.className += " blocked";
    window.setTimeout(function() {
      // Remove "blocked" from class name
      cell.className = cell.className.replace(" blocked", "");
    }, 100);
  }
}

function initCmdUI(execState) {
  let input = document.getElementById("command-input");
  input.style.display = "none";

  let viz = document.getElementById("command-viz");

  let indent = 0;
  for (let i = 0; i < execState.cmds.length; i++) {
    let cmd = execState.cmds[i];

    if (cmd.name === commands.ENDLOOP) {
      indent--;
    }

    let cmdDiv = document.createElement("div");
    cmdDiv.id = "index" + i;
    cmdDiv.className = "command";
    cmdDiv.innerText = "";
    for (let j = 0; j < indent*2; j++) {
      cmdDiv.innerText += "\xA0";
    }
    cmdDiv.innerText += cmd.name;

    if (cmd.name === commands.LOOP) {
      cmdDiv.innerText += " " + cmd.times + " times";
    }

    viz.appendChild(cmdDiv);

    if (cmd.name === commands.LOOP) {
      indent++;
    }
  }

  updateCmdUI(execState);
}

function updateCmdUI(execState) {
  let activeCmdDiv = document.getElementById("index" + execState.index);
  activeCmdDiv.className += " active";
/*
  let indexStack = execState.loopIndexStack;
  let stackTop = indexStack.length - 1;

  if (stackTop >= 0) {
    let itersStack = execState.loopItersStack;

    let index = indexStack[stackTop];
    let iters = itersStack[stackTop];

    let loopDiv = document.getElementById("index" + index);

    loopDiv.innerText = loopDiv.innerText.replace(/[0-9]+/g, iters);
  }
*/
  if (typeof updateCmdUI.lastActiveDiv !== "undefined") {
    updateCmdUI.lastActiveDiv.className =
        updateCmdUI.lastActiveDiv.className.replace(" active", "");
  }

  updateCmdUI.lastActiveDiv = activeCmdDiv;
}

function teardownCmdUI() {
  let input = document.getElementById("command-input");
  input.style.display = "";

  let viz = document.getElementById("command-viz");
  viz.innerHTML = "";
}

function getGridCell(x, y) {
  return document.getElementById("" + x + "," + y);
}

