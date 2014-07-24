var hue = require('./hue.js');



hue.init(function() {
    swap();
});


var colors = [

    {name: 'White',     on: true, ct:153, bri: 255},
    {name: 'Grey',      ct:153, bri: 0, on: true},
    {name: 'Black',     on: false, hue: 46000, bri: 0, transitiontimeFactor: 0.1},

    {name: 'blue',      hue: 45500, sat: 255, bri: 255, on: true},
    {name: 'red',       hue: 0,     sat: 255, bri: 245},
    {name: 'yellow',    hue: 10000, sat: 255, bri: 255},

    {name: 'green',     hue: 25500, sat: 255, bri: 150},
    {name: 'orange',    hue: 3000,  sat: 255, bri: 255},
    {name: 'violet',    hue: 48400, sat: 255, bri: 255, on: true},
    {quarters:[
        {name: 'citrine',    hue: 10000, sat: 255, bri: 150},
        {name: 'olive',     hue: 25500, sat: 255, bri: 70},
        {name: 'Black',     on: false, ct:153, bri: 0},
        {name: 'orange',    hue: 3000,  sat: 255, bri: 150}
    ]}
];



var transitionTime = 5000;
var holdTime = 55000;



/*
var colorIndex = 0;
var next = function() {
    // Down the tree
    colorIndex = (colorIndex + 1) % colors.length;
    swap();
};
*/

// Up the tree
var colorIndex = colors.length - 1;
var next = function() {

    colorIndex = (colorIndex - 1) % colors.length;
    swap();
};

var swap = function() {
    var color = colors[colorIndex];

    console.log(color);

    var state = color;
    if (state.transitiontimeFactor) {
        if (state.transitiontimeFactor > 0)
            state.transitiontime = (transitionTime / 100) * state.transitiontimeFactor;
    }
    else {
        state.transitiontime = transitionTime / 100;
    }


    if (state.quarters) {
        hue.setLightStateByArray(state.quarters, function() {});
    }
    else {
        hue.setLightStateAll(state, function() {});
    }


    setTimeout(function() {

        if (state.quarters) {
            hue.setLightStateByArray(state.quarters, function() {});
        }
        else {
            hue.setLightStateAll(state, function() {});
        }
    }, transitionTime);

    setTimeout(next, holdTime + transitionTime);
};

