var hue = require('./hue.js');




var up = {bri: 180, ct:475, interval:500, changePercent: 0.25};
var down = {bri: 150, ct:475, interval:500, changePercent: 0.25};

up.next = down;
down.next = up;

var execute = function(mode, index, send) {

    if (send) {
        var state = {
            ct: mode.ct,
            bri: mode.bri
        };
        hue.setLightState(index, state);
        hue.setLightState(index+1, state);
    }

    var p = Math.random();

    setTimeout(function() {
        if (p < mode.changePercent) {
            execute(mode.next, index, true);
        }
        else {
            execute(mode, index, false);
        }
    }, mode.interval);

};

hue.init(function() {
    execute(up, 1, true);
    execute(up, 4, true);
});