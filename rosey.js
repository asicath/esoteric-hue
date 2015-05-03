var hue = require('./hue.js');
var triangle = require('./triangle.js');

var convertPercentToXY = function(p, sat) {
    var coord = triangle.getXY(p, sat);
    return [coord.x, coord.y];
};

hue.init(function() {


    var vector = 1;
    var sat = 0.2;
    var incr = 0.1;

    //setInterval(function() {
        var state = {on:true, xy:convertPercentToXY(0.95, sat), bri:255};
    console.log(state);

    hue.setLightStateByArray([state, state, state, state]);

        //hue.setLightStateAll(state, function() {});

        sat += incr * vector;
        if (sat > 1) {
            sat = 1;
            vector = -1;
        }
        if (sat < 0) {
            sat = 0;
            vector = 1;
        }

    //}, 5000);

});



