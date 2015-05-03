var hue = require('./hue.js');

hue.init(function() {
    swap(1, true);
    swap(2, true);
    //swap(3, true);
    swap(4, true);
    swap(5, true);

    swap(6, true);
    swap(7, true);
});


var swap = function(index, first) {

    var transitionTime = Math.floor(Math.random() * 1000) + 10000;// 1000;
    var holdTime = 500;// Math.floor(Math.random() * 2000) + 1000;
    //var brightness = 255;

    //var transitionTime = 60000;
    //var holdTime = 500;// Math.floor(Math.random() * 2000) + 1000;


    var state = {
        hue: Math.floor(Math.random() * 3000) + 45500,
        sat: 255,
        bri: Math.floor(Math.random() * 200) + 55,
        transitiontime:Math.floor(transitionTime / 100)
    };

    if (first) {
        state.on = true;
    }

    console.log(state);

    hue.setLightState(index, state, function() {
        setTimeout(function() {
            swap(index, false);
        }, holdTime + transitionTime);
    });

};


