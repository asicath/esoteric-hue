var hue = require('./hue.js');



hue.init(function() {
    swap();
});

/*
var colors = [
    {name: 'Aries          Scarlet',       hue: 0,     sat: 255, bri: 245},
    {name: 'Taurus         Red orange',    hue: 2000,  sat: 255, bri: 255},
    {name: 'Gemini         Orange',    hue: 4000,  sat: 255, bri: 255},
    {name: 'Cancer         Amber',    hue: 8000,  sat: 255, bri: 255},
    {name: 'Leo            Yellow greenish',    hue: 20000, sat: 255, bri: 255}, // make more greenish?
    {name: 'Virgo          Green yellowish',    hue: 23000, sat: 255, bri: 255},
    {name: 'Libra          Emerald Green',     hue: 25500, sat: 255, bri: 255},
    //{name: 'Scorpio        Green blue',     hue: 35500, sat: 255, bri: 255},
    {quarters:[
        {name: 'citrine',    hue: 25500, sat: 255, bri: 255},
        {name: 'olive',     hue: 45500, sat: 255, bri: 255},
        {name: 'Black',     hue: 25500, sat: 255, bri: 255},
        {name: 'orange',    hue: 45500, sat: 255, bri: 255}
    ]},
    {name: 'Sagittarius    Blue',      hue: 45500, sat: 255, bri: 255},
    {name: 'Capricorn      Indigo',    hue: 47100, sat: 255, bri: 255},
    {name: 'Aquarius       Crimson (ultra violet)',    hue: 48400, sat: 255, bri: 255},
    {name: 'Pisces         Violet',    hue: 48400, sat: 255, bri: 255}
];
*/

var colors = [
    {name: 'yellow - mercury',    hue: 10000, sat: 100, bri: 255}, // mercury
    {name: 'yellow - mercury',    hue: 10000, sat: 255, bri: 255}, // mercury
    {name: 'blue - luna',      hue: 44750, sat: 255, bri: 255}, // luna
    {name: 'emerald green - venus',     hue: 25500, sat: 255, bri: 255}, // venus
    {name: 'Aries          Scarlet',       hue: 0,     sat: 255, bri: 245},
    {name: 'Taurus         Red orange',    hue: 2000,  sat: 255, bri: 255},
    {name: 'Gemini         Orange',    hue: 4000,  sat: 255, bri: 255},
    {name: 'Cancer         Amber',    hue: 8000,  sat: 255, bri: 255},
    {name: 'Leo            Yellow greenish',    hue: 20000, sat: 255, bri: 255}, // make more greenish?
    {name: 'Virgo          Green yellowish',    hue: 23000, sat: 255, bri: 255},
    {name: 'violet - jupiter',    hue: 48400, sat: 255, bri: 255}, // jupiter
    {name: 'Libra          Emerald Green',     hue: 25500, sat: 255, bri: 255},
    {name: 'blue - luna',      hue: 44750, sat: 255, bri: 200}, // luna
    //{name: 'Scorpio        Green blue',     hue: 35500, sat: 255, bri: 255},
    {quarters:[
        {name: 'citrine',    hue: 25500, sat: 255, bri: 255},
        {name: 'olive',     hue: 45500, sat: 255, bri: 255},
        {name: 'Black',     hue: 25500, sat: 255, bri: 255},
        {name: 'orange',    hue: 45500, sat: 255, bri: 255}
    ]},
    {name: 'Sagittarius    Blue',      hue: 45500, sat: 255, bri: 255},
    {name: 'Capricorn      Indigo',    hue: 47100, sat: 255, bri: 255},
    {name: 'scarlet - mars',       hue: 0,     sat: 255, bri: 245}, // mars,
    {name: 'Aquarius       Crimson (ultra violet)',    hue: 48400, sat: 255, bri: 255},
    {name: 'Pisces         Violet',    hue: 48400, sat: 255, bri: 255},
    {name: 'orange - sol',    hue: 3000,  sat: 255, bri: 255}, // sol
    {name: 'Aries          Scarlet',       hue: 2000,     sat: 255, bri: 245},
    {name: 'indigo - saturn',    hue: 47100, sat: 255, bri: 255, on: true} // saturn
];






var transitionTime = 5000;
var holdTime = 55000;



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

