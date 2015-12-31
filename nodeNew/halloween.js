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
        {name: 'orange',    hue: 3000,  sat: 255, bri: 255}, // sol
        {name: 'green',     hue: 25500, sat: 255, bri: 100}, // venus
        //{name: 'indigo',    hue: 47100, sat: 255, bri: 150}, // saturn
        {name: 'violet',    hue: 48400, sat: 255, bri: 255} // jupiter
    ];


    var hub;

    Hub.findAndConnect('10.0.0.', console.log, function(h) {
        hub = h;

        console.log('connected');

        swap(only(temple), 0);

        //swap(only(office));
        //swap(only(livingRoom));
        //swap(only(temple));
    });

    var swap = function(filter, colorIndex) {

        var transitionTime = 1000;
        var holdTime = 60000;

        var colorInfo = colors[colorIndex];
        var state = State.create(true, colorInfo.bri, Color.createByHS(colorInfo.hue, colorInfo.sat));

        hub.setState(state, filter, transitionTime, function() {
            console.log(colorInfo.name);
            setTimeout(function() {

                // choose the next color
                var nextColorIndex = colorIndex;
                while (nextColorIndex == colorIndex) {
                    nextColorIndex = Math.floor(Math.random() * colors.length);
                }

                swap(filter, nextColorIndex);
            }, holdTime + transitionTime);
        });

    };



});



