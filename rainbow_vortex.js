var hue = require('./hue.js');

hue.init(function() {
    next();
    setInterval(function() {
        next();
    }, (transitionTime + 1000) / 4);
});


var colors = [
    {name: 'red',       hue: 0,     sat: 255, bri: 245},
    {name: 'orange',    hue: 3000,  sat: 255, bri: 255},
    {name: 'yellow',    hue: 10000, sat: 255, bri: 255},
    {name: 'green',     hue: 25500, sat: 255, bri: 150},
    {name: 'blue',      hue: 44750, sat: 255, bri: 255},
    {name: 'indigo',    hue: 47100, sat: 255, bri: 255},
    {name: 'violet',    hue: 48400, sat: 255, bri: 255}
];

var transitionTime = 2000;

var swap = function(index, first, colorIndex) {



    var state = {
        hue: colors[colorIndex].hue,
        bri: colors[colorIndex].bri,
        transitiontime:Math.floor(transitionTime / 100)
    };

    if (first) {
        state.on = true;
        state.sat = 255;
    }

    hue.setLightState(index, state, function() { });
};


var lightOrder = [1, 3, 4, 2];
var lightIndex = 0;
var colorIndex = 0;

var next = function() {
    swap(lightOrder[lightIndex], true, colorIndex);

    //console.log(lightIndex + ' ' + colorIndex);

    lightIndex++;

    if (lightIndex == 4) {
        lightIndex = 0;
        colorIndex = (colorIndex + 1) % 7;
    }
};



