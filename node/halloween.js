var hue = require('./hue.js');

hue.init(function() {
    next();
});


var colors = [
    {name: 'orange - sol',    hue: 3000,  sat: 255, bri: 255}, // sol
    {name: 'emerald green - venus',     hue: 25500, sat: 255, bri: 100}, // venus
    {name: 'indigo - saturn',    hue: 47100, sat: 255, bri: 150}, // saturn
    {name: 'violet - jupiter',    hue: 48400, sat: 255, bri: 255} // jupiter
];

var transitionTime = 1000;
var holdTime = 60000;

var first = true;
var colorIndex = 0;

var next = function() {
    var nextColor = Math.floor(Math.random() * (colors.length - 1));
    if (nextColor == colorIndex) nextColor = colors.length - 1;
    colorIndex = nextColor;
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


