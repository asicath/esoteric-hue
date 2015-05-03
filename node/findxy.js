var hue = require('./hue.js');
var triangle = require('./triangle.js')

hue.init(function() {
    next();
    setInterval(next, 10000);

});

var convertPercentToXY = function(p) {
    var coord = triangle.getXY(p);
    return [coord.x, coord.y];
};

var color = {

};

color.XY = {
    red:    {on:true, xy:convertPercentToXY(0.00), bri:245},
    orange: {on:true, xy:convertPercentToXY(0.05), bri:255},
    yellow: {on:true, xy:convertPercentToXY(0.12), bri:255},
    green:  {on:true, xy:convertPercentToXY(0.2287), bri:150},
    blue:   {on:true, xy:convertPercentToXY(0.56), bri:255},
    indigo: {on:true, xy:convertPercentToXY(0.60), bri:150},
    violet: {on:true, xy:convertPercentToXY(0.65), bri:255}
};

color.Hue = {
    red:    {on: true, hue: 0,     sat: 255, bri: 245}, // mars,
    orange: {on: true, hue: 3000,  sat: 255, bri: 255}, // sol
    yellow: {on: true, hue: 10000, sat: 255, bri: 255}, // mercury
    green:  {on: true, hue: 25500, sat: 255, bri: 255}, // venus
    blue:   {on: true, hue: 44750, sat: 255, bri: 255}, // luna
    indigo: {on: true, hue: 47100, sat: 255, bri: 150}, // saturn
    violet: {on: true, hue: 48400, sat: 255, bri: 255}  // jupiter
};

var colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet'
];

var i = 1;
var setName = "XY";

function next() {
    var colorSet = color[setName];

    var state = colorSet[colors[i]];



    console.log(colors[i] + " " + JSON.stringify(state));

    hue.setLightStateTemple(state, function() {});
    //hue.setLightStateAll(state, function() {});

    i = (i + 1) % 7;
    //setName = setName == 'XY' ? 'Hue' : 'XY';
}
