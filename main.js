/// <reference path="typings/node/node.d.ts"/>
'use strict';

var argv = require('yargs').argv;
var bebop = require('node-bebop');
var keypress = require('keypress');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');

printControls();
var speed = 8;
var leftSpeed = 7;
var inAutonomousFlight = false;
var drone = bebop.createClient();

var IS_TEST = argv.test;

// drone events
drone.on('ready', function() {
  console.log('connected to drone');
});

drone.on('landing', function() {
  console.log('drone landing');
});

drone.on('landed', function() {
  console.log('drone landed');
});

drone.on('hovering', function() {
  console.log('drone hovering');
});

var STATE_WALL_FRONT = false;
var STATE_WALL_RIGHT = false;

// connect
console.log("connecting to drone...");
drone.connect(function() {
  
});

function resetDroneSpeed() {
  drone.stop();
  // drone.left(leftSpeed);
}

function quickBackward() {
  drone.backward(speed)
  setTimeout(function () {
    drone.stop();
  }, 500)
}

function quickLeft() {
  drone.left(speed)
  setTimeout(function () {
    drone.stop();
  }, 500)
}

function quickRight() {
  drone.right(speed)
  setTimeout(function () {
    drone.stop();
  }, 500)
}

function quickForward() {
  drone.forward(speed)
  setTimeout(function () {
    drone.stop();
  }, 500)
}


var WallDetector = require('./WallDetector');
// WallDetector.addChangeListener(onWallStateChange)

var goingRight = false;
WallDetector.addWallNoneListener(function(distance) {
  console.log("none:", distance)
  if (goingRight) {
    console.log("stoping right");
    goingRight = false;
    drone.stop();
    drone.left(5);
    setTimeout(function() {
      drone.forward(speed);
    }, 1000);
  }
  else {
    drone.left(5);
    drone.forward(speed);
  }
});

WallDetector.addWallInFrontListener(function(distance) {
  console.log("front:", distance)
  if (goingRight) {
    drone.right(speed);
  }
  else {
    goingRight = true;
    console.log("stoping forward");
    drone.stop();
    setTimeout(function() {
      drone.right(speed);
    }, 1000);
  }
});





if (!IS_TEST) {

  // Keyboard controls
  keypress(process.stdin);
  process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') {
      drone.emergency();
      process.exit();
    }
    else if (key && key.name == 'escape') {
      drone.emergency();
    }
    else if (key && key.name == 'space') {
      drone.stop();
    }
    else if (key && key.name == 'l') {
      drone.land();
    }
    else if (key && key.name == 't') {
      drone.takeOff();
    }

    else if (key && key.ctrl && key.name == 'w') {
      // resetDroneSpeed();
      drone.forward(speed);
    }
    else if (key && key.ctrl && key.name == 'a') {
      // resetDroneSpeed();
      drone.left(speed);
    }
    else if (key && key.ctrl && key.name == 'd') {
      // resetDroneSpeed();
      drone.right(speed);
    }
    else if (key && key.ctrl && key.name == 's') {
      // resetDroneSpeed();
      drone.backward(speed);
    }
    else if (key && key.name == 'w') {
      // resetDroneSpeed();
      quickForward(speed);
    }
    else if (key && key.name == 'a') {
      // resetDroneSpeed();
      quickLeft(speed);
    }
    else if (key && key.name == 'd') {
      // resetDroneSpeed();
      quickRight(speed);
    }
    else if (key && key.name == 's') {
      // resetDroneSpeed();
      quickBackward(speed);
    }

    else if (key && key.name == 'f') {
      drone.flatTrim()
      console.log('sendingFlatTrim');
    }
    else if (key && key.name == 'h') {
      printControls();
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
}

function printControls() {
  console.log('Usage')
  console.log('escape:     emergency');
  console.log('space:      stop');
  console.log('l:          land');
  console.log('t:          takeOff');
  console.log('up:         forward');
  console.log('left:       left');
  console.log('f:          flattrim');
  console.log('a:          start autonomous flight');
  console.log('h:          help');
  console.log();
}

// Silly autonomous flight
// function startAutonomousFlight() {
//   if (inAutonomousFlight) {
//     return;
//   }
//   console.log('starting autonomous flight');
//   // drone.flatTrim();
//   inAutonomousFlight = true;
//   drone.takeOff();

//   setTimeout(function() {
//     drone.left(leftSpeed);
//   }, 1500);

//   setTimeout(function() {
//     drone.forward(speed);
//   }, 3000);

//   setTimeout(function() {
//     drone.stop();
//     drone.left(leftSpeed);
//   }, 5000);

//   setTimeout(function() {
//     drone.left(leftSpeed + 5);
//   }, 6000)

//   setTimeout(function() {
//     drone.stop();
//   }, 7000);

//   setTimeout(function() {
//     drone.left(leftSpeed);
//     drone.forward(speed);
//   }, 8000);

//   setTimeout(function() {
//     drone.left(leftSpeed);
//     drone.forward(speed);
//   }, 10000);

//   setTimeout(function() {
//     drone.land();
//     inAutonomousFlight = false;
//   }, 10500);
// }

// function onWallStateChange(state) {
//   if (state.wallPosition == "f") {
//     resetDroneSpeed();
//     drone.back(speed);    
//   }
//   if (state.wallPosition = "r") {
//     resetDroneSpeed();
//     drone.left(leftSpeed + speed);
//   }
//   if (state.wallPosition = "l") {
//     resetDroneSpeed();
//     drone.right(speed);
//   }
//   if (state.wallPosition = "b") {
//     resetDroneSpeed();
//     drone.forward(speed);
//   }
// }