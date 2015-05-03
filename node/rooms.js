var hue = require('./hue.js');
var triangle = require('./triangle.js');

var transitionTime = 1000;
var wait = 2000;

hue.init(function() {
    nextRainbow();
    setInterval(nextRainbow, transitionTime + wait);

});

var convertPercentToXY = function(p) {
    var coord = triangle.getXY(p, 1);
    return [coord.x, coord.y];
};



var rainbow = [
    {on:true, xy:convertPercentToXY(0.00), bri:245,   transitiontime: Math.floor(transitionTime / 100)}, // red MARS
    {on:true, xy:convertPercentToXY(0.05), bri:255,   transitiontime: Math.floor(transitionTime / 100)}, // orange SOL
    {on:true, xy:convertPercentToXY(0.12), bri:255,   transitiontime: Math.floor(transitionTime / 100)}, // yellow MERCURY
    {on:true, xy:convertPercentToXY(0.2287), bri:150, transitiontime: Math.floor(transitionTime / 100)}, // green VENUS
    {on:true, xy:convertPercentToXY(0.56), bri:255,  transitiontime: Math.floor(transitionTime / 100)}, // blue LUNA
    {on:true, xy:convertPercentToXY(0.65), bri:255,   transitiontime: Math.floor(transitionTime / 100)}, // violet JUPITER
    {on:true, xy:convertPercentToXY(0.60), bri:150,  transitiontime: Math.floor(transitionTime / 100)} // indigo SATURN
];


//var current = [0, 6, 5];
var current = [0, 0, 0];


function nextRainbow() {

    var state = [
        rainbow[current[0]],
        rainbow[current[1]],
        rainbow[current[2]]
    ];

    // temple : last
    setTimeout(function() {
        hue.setLightState(6, state[0]);
        hue.setLightState(7, state[0]);
    }, Math.floor(transitionTime * (2/3)));


    // middle
    setTimeout(function() {
       hue.setLightState(4, state[1]);
       hue.setLightState(5, state[1]);
    }, Math.floor(transitionTime * (1/3)));

    // living : first
    hue.setLightState(1, state[2]);
    hue.setLightState(2, state[2]);

    // living : first
    //hue.setLightState(3, state[2]);



    current[0] = (current[0]+1) % 7;
    current[1] = (current[1]+1) % 7;
    current[2] = (current[2]+1) % 7;
}





var prev = [0, 0, 0];

function getNewRandom(i) {
    var p = prev[i];
    var next = p;

    while (Math.abs(p - next) < 0.1 || (next > 0.23 && next < 0.56)) {
        next = Math.random();

        console.log(Math.abs(p - next));
    }

    prev[i] = next;
}

function nextRandom() {
    prev[2] = prev[1];
    prev[1] = prev[0];
    getNewRandom(0);

    //getNewRandom(1);

    var transitionTime = 1000;
    var state0 =  {on:true, xy:convertPercentToXY(prev[0]), bri:255, transitiontime:Math.floor(transitionTime / 100)};
    var state1 =  {on:true, xy:convertPercentToXY(prev[1]), bri:255, transitiontime:Math.floor(transitionTime / 100)};
    var state2 =  {on:true, xy:convertPercentToXY(prev[2]), bri:255, transitiontime:Math.floor(transitionTime / 100)};

    hue.setLightState(6, state2);
    hue.setLightState(7, state2);

    setTimeout(function() {
        hue.setLightState(1, state0);
        hue.setLightState(2, state0);
    }, 500);

    setTimeout(function() {
        hue.setLightState(4, state1);
        hue.setLightState(5, state1);
    }, 1000);


}
