var hue = require('./hue.js');

hue.init(function() {
    swap();
});


var colors = [
    {name: 'scarlet - mars',       hue: 0,     sat: 255, bri: 245}, // mars,
    {name: 'orange - sol',    hue: 3000,  sat: 255, bri: 255}, // sol
    {name: 'yellow - mercury',    hue: 10000, sat: 255, bri: 255}, // mercury
    {name: 'emerald green - venus',     hue: 25500, sat: 255, bri: 255}, // venus
    {name: 'blue - luna',      hue: 44750, sat: 255, bri: 255}, // luna
    {name: 'indigo - saturn',    hue: 47100, sat: 255, bri: 150}, // saturn
    {name: 'violet - jupiter',    hue: 48400, sat: 255, bri: 255} // jupiter
];

var transitionTime = 1000;
var holdTime = 6000;

var first = true;
var colorIndex = 4;

var next = function() {
    colorIndex = (colorIndex + 1) % colors.length;
    swap();
};

var swap = function() {
    var color = colors[colorIndex];

    console.log(color);

    var state = {
        hue: color.hue,
        sat: color.sat,
        bri: color.bri,
        transitiontime:transitionTime / 100
    };

    if (first) {
        state.on = true;
    }

    hue.setLightStateAll(state, function() {
        setTimeout(next, holdTime);
    });
};


