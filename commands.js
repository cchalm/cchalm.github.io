"use strict";

let commands = Object.freeze({
  STEP: "step",
  LEFT: "left",
  RIGHT: "right",
  LOOP: "loop",
  ENDLOOP: "endloop"
});

let reset = false;

function run() {
  let cmds;

  document.getElementById("errors").innerText = "";
  try {
    cmds = parseCommands(document.getElementById("command-input").value);
  } catch (e) {
    document.getElementById("errors").innerText = e;
    return;
  }

  if (cmds.length === 0)
    return;

  document.getElementById("run-btn").disabled = true;

  let execState = {
    index: 0,
    cmds: cmds,
    loopItersStack: [],
    loopIndexStack: []
  };

  initCmdUI(execState);

  runHelper(execState);
}

function runHelper(execState) {
  let cmd = execState.cmds[execState.index];

  let blocked = false;
  let speed = parseInt(document.getElementById("speed-input").value);
  let maxDelay = 1000;
  let delay = maxDelay - (speed * maxDelay / 100);

  let isMovementCmd = true;

  switch (cmd.name) {

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
      } else {
        blocked = true;
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

    case commands.LOOP:
      assert(cmd.times > 0);

      delay = 0;

      execState.loopItersStack.push(cmd.times);
      execState.loopIndexStack.push(execState.index);

      isMovementCmd = false;

      break;
    case commands.ENDLOOP:
      let indexStack = execState.loopIndexStack;
      let itersStack = execState.loopItersStack;
      assert(indexStack.length > 0
             && indexStack.length === itersStack.length);

      delay = 0;

      let numItersLeft = itersStack.pop() - 1;
      if (numItersLeft > 0) {
        itersStack.push(numItersLeft);
        execState.index = indexStack[indexStack.length - 1];
      } else {
        indexStack.pop();
      }

      isMovementCmd = false;

      break;
  
  }

  if (isMovementCmd) {
    updateGridUI(blocked);
    updateCmdUI(execState);
  }

  execState.index++;
  if (execState.index >= execState.cmds.length || reset) {
    document.getElementById("run-btn").disabled = false;
    teardownCmdUI();
    return;
  }

  window.setTimeout(runHelper, delay, execState);
}

function parseCommands(inputText) {
  let cmds = [];
  let errs = [];

  let loopStackLen = 0;

  let lines = inputText.split('\n'); 
  for (let line of lines) {
    line = line.trim().toLowerCase();

    if (line.length === 0)
      continue;

    let args = line.split(/\s+/g);
    let cmdName = args.shift();

    if (cmdName === "level2"
        || cmdName === "leveltwo"
        || (cmdName === "level" && args.length === 1
           && (args[0] === "2" || args[0] === "two"))) {
      window.location.href = "./level2/index.html";
      return;
    }

    switch (cmdName) {
      case commands.ENDLOOP:
        if (loopStackLen === 0) {
          errs.push(line);
        } else {
          loopStackLen--;
        }
        // Intentionally no break
      case commands.STEP:
      case commands.LEFT:
      case commands.RIGHT:
        if (args.length !== 0) {
          errs.push(line);
          break;
        }

        cmds.push({ name: cmdName });
        break;
      case commands.LOOP:
        loopStackLen++;

        if (args.length !== 2 || args[1] !== "times") {
          errs.push(line);
          break;
        }

        let times;
        try {
          times = parseInt(args[0]);
        } catch (e) {
          errs.push(line);
          break;
        }

        if (times < 1)
          errs.push(line);

        cmds.push({ name: cmdName, times: times }); 
        break;
      default:
        errs.push(line);
    }
  }

  let errStr = ""

  if (errs.length !== 0) {
    errStr += "Invalid line(s):";
    for (let err of errs) {
      errStr += "\n  " + err;
    }
  }

  if (loopStackLen > 0) {
    if (errStr.length !== 0)
      errStr += "\n";
    errStr += "Loop tags without endloops: " + loopStackLen;
  }

  if (errStr.length !== 0) {
    throw errStr;
  }

  return cmds;
}
