var huee = require('./hue.js');

huee.init(function() {
    Explore(48400, 1500);
});



var Explore = function(base, range) {

    var swap = function(index, first) {

        var hue = Math.floor(Math.random() * range * 2) + base - range;
        if (hue < 0) { hue += 65535;}
        if (hue > 65535) {hue -= 65535;}



        var transitionTime = Math.floor(Math.random() * 1000) + 10000;
        var holdTime = 500;

        var brightness = Math.floor(Math.random() * 200) + 55;

        var state = {
            hue: hue,
            sat: 255,
            bri: brightness,
            transitiontime:Math.floor(transitionTime / 100)
        };

        if (first) {
            state.on = true;
            state.bri = 255;
        }

        console.log(state);

        huee.setLightState(index, state, function() {
            setTimeout(function() {
                swap(index, false);
            }, holdTime + transitionTime);
        });

    };

    swap(1, true);
    swap(2, true);
    swap(3, true);
    swap(4, true);
};
