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

    var colors = [
        {name: 'blue - luna',       color: Color.BLUE, bri: 254},
        {name: 'yellow - mercury',  color: Color.createByTriangle(0.12, 1.0), bri: 254},
        {name: 'green - venus',     color: Color.GREEN, bri: 150},
        {name: 'orange - sol',      color: Color.createByTriangle(0.05, 1.0), bri: 254},
        {name: 'scarlet - mars',    color: Color.RED, bri: 245},
        {name: 'violet - jupiter',  color: Color.createByTriangle(0.65, 1.0), bri: 254},
        {name: 'indigo - saturn',   color: Color.createByTriangle(0.60, 1.0), bri: 150}

    ];

    var hub;

    Hub.findAndConnect('10.0.1.', console.log, function(h) {
        hub = h;

        console.log('connected');

        swap(only(temple), 6);

        //swap(only(office));
        //swap(only(livingRoom));
        //swap(only(temple));
    });

    var swap = function(filter, colorIndex) {

        var transitionTime = 1000;
        var holdTime = 60000;

        var colorInfo = colors[colorIndex];
        var state = State.create(true, colorInfo.bri, colorInfo.color);

        hub.setState(state, filter, transitionTime, function() {
            console.log(colorInfo.name);
            setTimeout(function() {
                swap(filter, (colorIndex + 1) % 7);
            }, holdTime + transitionTime);
        });

    };



});



