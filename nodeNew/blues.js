var requirejs = require('requirejs');

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'jquery': 'jquery.min',
        'http-active': 'hue/http-node'
    }
});

requirejs([
    'hue/hub',
    'hue/color',
    'hue/state',
    'lodash'
], function(
    Hub,
    Color,
    State,
    _
) {

    var temple = ["Temple 1", "Temple 2"];
    var office = ["Office W","Office E"];
    var livingRoom = ["Living Room W","Living Room E"];
    var all = temple.concat(office).concat(livingRoom);
    var allExcept = function(names) { return function(light) { return !_.contains(names, light.name); }; };
    var only = function(names) { return function(light) { return _.contains(names, light.name); }; };

    var hub;

    Hub.findAndConnect('10.0.0.', console.log, function(h) {
        hub = h;

        console.log('connected');

        var state = State.create(true, 200, Color.createByTriangle(0.56, 1.0));
        hub.setState(state, only(office), 5000);

    });


    var swap = function(index, first) {

        var transitionTime = Math.floor(Math.random() * 1000) + 10000;// 1000;
        var holdTime = 500;


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



});



