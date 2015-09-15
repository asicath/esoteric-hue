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
        pulseUp(0, only(office.concat(livingRoom.concat(temple))));
    });

    var hueValue = Math.floor(Math.random() * 3000) + 45500;
    var color = Color.createByTriangle(0.2287, 1.0);
    var stateUp = State.create(true, 255, color);
    var stateDown = State.create(true, 0, color);

    var pulseUp = function(i, filter) {
        var transitionTime = 1000;
        var holdtime = 5000;
        var state = State.create(true, 255, rainbow[i]);
        hub.setState(state, filter, transitionTime, function() {
            setTimeout(function() {
                pulseDown(i, filter);
            }, holdtime + transitionTime);
        });
    };

    var pulseDown = function(i, filter) {
        var transitionTime = 500;
        var state = State.create(true, 0, rainbow[i]);
        hub.setState(state, filter, transitionTime, function() {
            setTimeout(function() {
                change(i+1, filter);
            }, transitionTime);
        });
    };

    var change = function(i, filter) {

        if (i >= rainbow.length) {
            i = 0;
        }

        var transitionTime = 500;
        var state = State.create(true, 0, rainbow[i]);
        hub.setState(state, filter, transitionTime, function() {
            setTimeout(function() {
                pulseUp(i, filter);
            }, transitionTime);
        });
    };

    var rainbow = [
        Color.createByTriangle(0.00, 1.0),
        Color.createByTriangle(0.05, 1.0),
        Color.createByTriangle(0.12, 1.0),
        Color.createByTriangle(0.2287, 1.0),
        Color.createByTriangle(0.56, 1.0),
        Color.createByTriangle(0.60, 1.0),
        Color.createByTriangle(0.65, 1.0)
    ];


});



