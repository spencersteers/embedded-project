Group 2 Autonomous Bebop drone. UC Denver CSCI 4287


Requires [node.js](http://nodejs.org) to be installed.

## Running

```
    git clone http://github.com/spencersteers/embedded-project
    cd embedded-project
    npm install
    node main.js
```

## Options

Set calibration variables in `main.js` to account for drift. If running with raspberry pi, pins are set in `WallDetector.js` -> `usonic.createSensor(23, 18, 999);`.

When using a Raspberry Pi run with `node main.js --pi`. This will initialize the sensor and read values from it. If not `o` and `p` can be used to simulate a wall instead of using the sensor. 



