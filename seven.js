var hue = require('./hue.js');

hue.init(function() {
    swap();
});


var colors = [
    {name: 'red',       hue: 0,     sat: 255, bri: 245},
    {name: 'orange',    hue: 3000,  sat: 255, bri: 255},
    {name: 'yellow',    hue: 10000, sat: 255, bri: 255},
    {name: 'green',     hue: 25500, sat: 255, bri: 255},
    {name: 'blue',      hue: 44750, sat: 255, bri: 255},
    {name: 'indigo',    hue: 47100, sat: 255, bri: 255},
    {name: 'violet',    hue: 48400, sat: 255, bri: 255}
];

var transitionTime = 10000;
var holdTime = 60000;

var first = true;
var colorIndex = 0;

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


