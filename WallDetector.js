var argv = require('yargs').argv;
var keypress = require('keypress');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var WALL_IN_FRONT = "wallInFront";
var WALL_NONE = "wallNone";
var currentDistance = 0;
var distanceThreshold = 40;


var WallDetector = _.assign({}, EventEmitter.prototype, {

  emitWallInFront: function() {
    this.emit(WALL_IN_FRONT, currentDistance);
  },

  emitWallNone: function() {
    this.emit(WALL_NONE, currentDistance);
  },

  addWallInFrontListener: function(callback) {
    this.on(WALL_IN_FRONT, callback);
  },

  addWallNoneListener: function(callback) {
    this.on(WALL_NONE, callback);
  },

  removeWallInFrontListener: function(callback) {
    this.removeListener(WALL_IN_FRONT, callback);
  },

  removeWallNoneListener: function(callback) {
    this.removeListener(WALL_IN_FRONT, callback);
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
    else if (distance < this.distanceThreshold) {
      currentDistance = distance;
      WallDetection.emitWallInFront();
    }
    else if (distance >= this.distanceThreshold) {
      currentDistance = distance;
      WallDetection.emitWallNone();
    }
  }, 1000);
}
else {
  keypress(process.stdin);
  process.stdin.on('keypress', function (ch, key) {
    if (!argv.pi) {
      if (key && key.name == 'o') {
        currentDistance = distanceThreshold - 10;
        WallDetection.emitWallInFront();
      }
      if (key && key.name == 'p') {
        currentDistance = distanceThreshold + 10;
        WallDetection.emitWallNone();
      }
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
}


module.exports = WallDetector;