var hue = require('./hue.js');

var colors = [
    {name: 'red',       hue: 0,     sat: 255, bri: 245},
    {name: 'orange',    hue: 3000,  sat: 255, bri: 255},
    {name: 'yellow',    hue: 10000, sat: 255, bri: 255},
    {name: 'green',     hue: 25500, sat: 255, bri: 150},
    {name: 'blue',      hue: 44750, sat: 255, bri: 255},
    {name: 'indigo',    hue: 47100, sat: 255, bri: 255},
    {name: 'violet',    hue: 48400, sat: 255, bri: 255}
];

// current light state
var lightColor = [];
var lightBright = [];
var interval = 500;

var chance = function(index) {

    var state = {};

    if (!lightColor[index]) {
        state.on = true;
        state.sat = 255;

        lightColor[index] = index;
        lightBright[index] = 0;
    }

    var r = Math.random();


    if (r > 0.3) {
        // do nothing
        setTimeout(function() { chance(index); }, interval);
        return;
    }
    else if (r > 0.03) {
        if (lightBright[index] == 0) {
            lightBright[index] = -30;
        }
        else {
            lightBright[index] = 0;
        }
    }
    else {
        lightColor[index] = (lightColor[index] + 1) % 7;
    }

    var color = colors[lightColor[index]];

    state.hue = color.hue;
    state.bri = color.bri + lightBright[index];

    hue.setLightState(index, state, function() {
        setTimeout(function() { chance(index); }, interval);
    });


};



// Start it up
hue.init(function() {
    chance(1);
    chance(2);
    chance(3);
    chance(4);
});
