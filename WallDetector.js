var argv = require('yargs').argv;
var keypress = require('keypress');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

// wall detection event emitter
var WALL_STATE_CHANGE = "wallStateChange";

var currentState = {
  wallPosition: "",
  wallDistance: 10
};

var WallDetection = _.assign({}, EventEmitter.prototype, {

  getState: function() {
    return currentState;
  },
  
  emitWallStateChange: function() {
    this.emit(WALL_STATE_CHANGE, currentState);
  },

  addChangeListener: function(callback) {
    this.on(WALL_STATE_CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(WALL_STATE_CHANGE, callback);
  }
});

if (argv.pi) {

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
      if (key && key.name == 'w') {
        toggleState('f');
        WallDetection.emitWallStateChange();
        console.log("current state", currentState);
      }
      else if (key && key.name == 'd') {
        toggleState('r');
        WallDetection.emitWallStateChange();
        console.log("current state", currentState);
      }
      else if (key && key.name == 's') {
        toggleState('b');
        WallDetection.emitWallStateChange();
        console.log("current state", currentState);
      }
      else if (key && key.name == 'a') {
        toggleState('l');
        WallDetection.emitWallStateChange();
        console.log("current state", currentState);
      }
    }
  });
  process.stdin.setRawMode(true);
  process.stdin.resume();
}


module.exports = WallDetection;