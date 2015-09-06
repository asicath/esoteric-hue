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

        var state = State.create(true, 200, Color.createByTriangle("blue", 0.56, 1.0));
        hub.setState(state, only(office), 5000);

    });



});



