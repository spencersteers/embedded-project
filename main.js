/// <reference path="typings/node/node.d.ts"/>
'use strict';

var argv = require('yargs').argv;
var bebop = require('node-bebop');
var keypress = require('keypress');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');

printControls();
var speed = 3;
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
  drone.left(leftSpeed);
}

// Silly autonomous flight
function startAutonomousFlight() {
  if (inAutonomousFlight) {
    return;
  }
  console.log('starting autonomous flight');
  // drone.flatTrim();
  inAutonomousFlight = true;
  drone.takeOff();

  setTimeout(function() {
    drone.left(leftSpeed);
  }, 1500);

  setTimeout(function() {
    drone.forward(speed);
  }, 3000);

  setTimeout(function() {
    drone.stop();
    drone.left(leftSpeed);
  }, 5000);

  setTimeout(function() {
    drone.left(leftSpeed + 5);
  }, 6000)

  setTimeout(function() {
    drone.stop();
  }, 7000);

  setTimeout(function() {
    drone.left(leftSpeed);
    drone.forward(speed);
  }, 8000);

  setTimeout(function() {
    drone.left(leftSpeed);
    drone.forward(speed);
  }, 10000);

  setTimeout(function() {
    drone.land();
    inAutonomousFlight = false;
  }, 10500);
}

function onWallStateChange(state) {
  if (state.wallPosition == "f") {
    resetDroneSpeed();
    drone.back(speed);    
  }
  if (state.wallPosition = "r") {
    resetDroneSpeed();
    drone.left(leftSpeed + speed);
  }
  if (state.wallPosition = "l") {
    resetDroneSpeed();
    drone.right(speed);
  }
  if (state.wallPosition = "b") {
    resetDroneSpeed();
    drone.forward(speed);
  }
}

var WallDetector = require('./WallDetector');
WallDetector.addChangeListener(onWallStateChange)



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
      setTimeout(function() {
        drone.down(2);
      }, 2000);
    }
    else if (key && key.name == 'up') {
      resetDroneSpeed();
      drone.forward(speed);
    }
    else if (key && key.name == 'left') {
      resetDroneSpeed();
      drone.left(10);
    }
    else if (key && key.name == 'right') {
      resetDroneSpeed();
      drone.right(10);
    }
    else if (key && key.name == 'a') {
      startAutonomousFlight();
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


