var argv = require('yargs').argv;
var keypress = require('keypress');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


// wall detection event emitter
var WALL_STATE_CHANGE = "wallStateChange";


var WALL_IN_FRONT = "wallInFront";
var WALL_NONE = "wallNone";
var currentState = {
  wallPosition: "",
  wallDistance: 10
};

var currentDistance = 0;



var WallDetection = _.assign({}, EventEmitter.prototype, {

  getState: function() {
    return currentState;
  },
  
  emitWallInFront: function() {
    this.emit(WALL_IN_FRONT, currentDistance);
  },

  emitWallNone: function() {
    this.emit(WALL_NONE, currentDistance);
  },

  emitWallStateChange: function() {
    this.emit(WALL_STATE_CHANGE, currentDistance);
  },

  addChangeListener: function(callback) {
    this.on(WALL_STATE_CHANGE, callback);
    this.on(WALL_IN_FRONT, callback);
    this.on(WALL_NONE, callback);
  },

  addWallInFrontListener: function(callback) {
    this.on(WALL_IN_FRONT, callback);
  },

  addWallNoneListener: function(callback) {
    this.on(WALL_NONE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(WALL_STATE_CHANGE, callback);
    this.removeListener(WALL_IN_FRONT, callback);
    this.removeListener(WALL_NONE, callback);
  }
});

if (argv.pi) {
  var usonic = require('r-pi-usonic');
  var sensor = usonic.createSensor(23, 18, 999);

  setInterval(function() {
    var distance = sensor();

    if (distance == -1) {
      console.log("sensor not reading");
    }
    else if (distance < 40) {
      currentDistance = distance;
      WallDetection.emitWallStateChange();
      WallDetection.emitWallInFront();
    }
    else if (distance >= 40) {
      currentDistance = distance;
      WallDetection.emitWallStateChange();
      WallDetection.emitWallNone();
    }
  }, 1000);
}
else {
  function toggleState(pos) {
    if (currentState.wallPosition == pos) {
      currentState.wallPosition = "n";
      currentState.wallDistance = 0;
    }
    else {
      currentState.wallPosition = pos;
      currentState.wallDistance = 10;
    }
  }

  keypress(process.stdin);
  process.stdin.on('keypress', function (ch, key) {
    if (!argv.pi) {
      if (key && key.name == 'o') {
        var distance = 30;
        if (distance < 40) {
          currentDistance = distance;
          WallDetection.emitWallStateChange();
          WallDetection.emitWallInFront();
        }
        else if (distance >= 40) {
          currentDistance = distance;
          WallDetection.emitWallStateChange();
          WallDetection.emitWallNone();
        }
      }
      if (key && key.name == 'p') {
        var distance = 60;
        if (distance < 40) {
          currentDistance = distance;
          WallDetection.emitWallStateChange();
          WallDetection.emitWallInFront();
        }
        else if (distance >= 40) {
          currentDistance = distance;
          WallDetection.emitWallStateChange();
          WallDetection.emitWallNone();
        }
      }
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
}


module.exports = WallDetection;