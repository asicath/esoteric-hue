var hue = require('./hue.js');


var last = [];

hue.init(function() {
    //swap(1, true);
    //swap(2, true);
    //swap(3, true);
    //swap(4, true);
    next(1);
    next(2);
    next(3);
    next(4);
});

var interval = 500;

var next = function(index) {

    if (!last[index]) {
        swap(index, true);
        return;
    }

    var p = Math.random();

    if (p < 0.25) {
        swap(index, false);
    }
    else {
        setTimeout(function() {
            next(index);
        }, interval);
    }


};


var swap = function(index, first) {

    var state = {};

    if (!last[index] || last[index].low) {
        state.ct = 400;
        state.bri = 200;
        last[index] = {high:true};
    }
    else {
        state.ct = 400;
        state.bri = 180;
        last[index] = {low:true};
    }

    if (first) {
        state.on = true;
    }

    console.log(state);

    hue.setLightState(index, state, function() {
        setTimeout(function() {
            next(index);
        }, interval);
    });

};


