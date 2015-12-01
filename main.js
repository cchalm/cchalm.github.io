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
    player.setPos(4, 4);

    initUI();

    document.getElementById("reset-btn").onclick = function() {
      player.setPos(4, 4);
      player.oriental = orientals.NORTH;
      updateUI();
    };
    document.getElementById("run-btn").onclick = run;

    let addingBlocks = false;
    let mouseDown = false;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {

        let elem = document.getElementById("" + x + "," + y);

        elem.onmousedown = function() {
          if (grid.hasBlockAt(x, y)) {
            grid.removeBlockAt(x, y);
            addingBlocks = false;
          } else {
            grid.addBlockAt(x, y);
            addingBlocks = true;
          }

          mouseDown = true;
          updateUI(false);
        }
/*
        elem.onmousemove = function() {
          if (mouseDown && (addingBlocks !== grid.hasBlockAt(x, y))) {
            if (addingBlocks)
              grid.addBlockAt(x, y);
            else
              grid.removeBlockAt(x, y);
            updateUI(false);
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

function initUI() {
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

  updateUI(false);
}

function updateUI(blocked) {
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

    // TODO this is a hack
    let properColor;
    if (target.isAt(player.x, player.y))
      properColor = "blue";
    else if (grid.hasBlockAt(player.x, player.y))
      properColor = "black";
    else
      properColor = "white";

    cell.style.backgroundColor = "red";
    window.setTimeout(function() {
      cell.style.backgroundColor = properColor;
    }, 100);
  }
}

function getGridCell(x, y) {
  return document.getElementById("" + x + "," + y);
}

