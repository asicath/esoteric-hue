var hue = require('./hue.js');

var allOff = function(time) {
    var state = {
        on: false,
        transitiontime: time / 100
    };
    hue.setLightStateAll(state);
};

var allOn = function(time) {
    var state = {
        on: true,
        transitiontime: time / 100,
        sat: 255,
        bri: 255,
        hue: 47100
    };
    setLightStateAll(state);
};

hue.init(function() {
    allOff();
});