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
    grid.addBlockAt(5, 5);

    target.setPos(7, 8);
    player.setPos(4, 4);

    document.getElementById("run-btn").onclick = run;

    show();
  })
}

function show(blocked) {
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

      if (target.x === colNum && target.y === rowNum) {
        col.className += " target";
      }

      if (player.isAt(colNum, rowNum)) {
        col.className += " player-" + player.oriental;
      }

      row.appendChild(col);
    }

    table.appendChild(row);
  }

  if (blocked) {
    let square = getGridSquare(player.x, player.y);
    let origColor = square.style.backgroundColor;
    square.style.backgroundColor = "red";
    window.setTimeout(function() {
      square.style.backgroundColor = origColor;
    }, 300);
  }
}

function getGridSquare(x, y) {
  return document.getElementById("" + x + "," + y);
}

