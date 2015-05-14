var argv = require('yargs').argv;
var bebop = require('node-bebop');
var keypress = require('keypress');


// base variables
var speed = 10;
// when calling reset these values will be used
// for initial spped. use to remove drifting
var forwardSpeedCalibration = 0;
var backwardSpeedCalibration = 0;
var leftSpeedCalibration = 0;
var rightSpeedCalibration = 0;



var drone = bebop.createClient();
printControls();
// connect
console.log("connecting to drone...");
drone.connect(function() {
    
});


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

function resetDroneSpeed() {
  drone.stop();
  drone.forward(forwardSpeedCalibration);
  drone.backward(backwardSpeedCalibration);
  drone.left(leftSpeedCalibration);
  drone.right(rightSpeedCalibration);
}

// set a speed and stop;
function quickBackward() {
  drone.backward(speed)
  setTimeout(function () {
    resetDroneSpeed();
  }, 500)
}

function quickLeft() {
  drone.left(speed)
  setTimeout(function () {
    resetDroneSpeed();
  }, 500)
}

function quickRight() {
  drone.right(speed)
  setTimeout(function () {
    resetDroneSpeed();
  }, 500)
}

function quickForward() {
  drone.forward(speed)
  setTimeout(function () {
    resetDroneSpeed();
  }, 500)
}

// Detector events
var WallDetector = require('./WallDetector');
var goingRight = false;
WallDetector.addWallNoneListener(function(distance) {
  if (goingRight) {
    console.log("stoping right");
    goingRight = false;
    resetDroneSpeed()
    setTimeout(function() {
      drone.forward(speed);
    }, 2000);
  }
  else {
    drone.forward(speed);
  }
});

WallDetector.addWallInFrontListener(function(distance) {
  if (goingRight) {
    drone.right(speed);
  }
  else {
    console.log("stoping forward");
    goingRight = true;
    resetDroneSpeed();
    setTimeout(function() {
      drone.right(speed);
    }, 2000);
  }
});

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


function printControls() {
  console.log('Usage')
  console.log('escape:     emergency');
  console.log('space:      stop');
  console.log('l:          land');
  console.log('t:          takeOff');
  console.log('w:          forward');
  console.log('d:          right');
  console.log('a:          left');
  console.log('s:          backward');
  console.log('f:          flattrim');
  if (!argv.pi) {
    console.log('o:          simulate wall in front');
    console.log('p:          simulate no wall');
  }
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
//     drone.left(leftSpeedCalibration);
//   }, 1500);

//   setTimeout(function() {
//     drone.forward(speed);
//   }, 3000);

//   setTimeout(function() {
//     drone.stop();
//     drone.left(leftSpeedCalibration);
//   }, 5000);

//   setTimeout(function() {
//     drone.left(leftSpeedCalibration + 5);
//   }, 6000)

//   setTimeout(function() {
//     drone.stop();
//   }, 7000);

//   setTimeout(function() {
//     drone.left(leftSpeedCalibration);
//     drone.forward(speed);
//   }, 8000);

//   setTimeout(function() {
//     drone.left(leftSpeedCalibration);
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
//     drone.left(leftSpeedCalibration + speed);
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