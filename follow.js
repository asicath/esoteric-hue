
var hue = require('./hue.js');

hue.init(function() {
    start();
});


var transitionTime = 1000;
var holdTime = 3000;
var index = 0;

var bright = [
    {transitiontime:transitionTime / 100, hue: 0},
    {transitiontime:transitionTime / 100, hue: 0},
    {transitiontime:transitionTime / 100, hue: 10000},
    {transitiontime:transitionTime / 100, hue: 10000}
];

var swap = function() {

    var finished = 0;
    var waitForFinish = function() {
        if (++finished == 4) {
            index++;
            setTimeout(function() {swap();}, holdTime);
        }
    };

    hue.setLightState(2, bright[(index + 0) % bright.length], waitForFinish);
    hue.setLightState(4, bright[(index + 1) % bright.length], waitForFinish);
    hue.setLightState(3, bright[(index + 2) % bright.length], waitForFinish);
    hue.setLightState(1, bright[(index + 3) % bright.length], waitForFinish);

};

var start = function() {
    var state = {
        on: true,
        transitiontime: 1,
        sat: 255,
        bri: 0,
        ct: 153
    };

    hue.setLightStateAll(state, function() {
        swap();
    });
};


