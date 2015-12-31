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

    var rainbow = [
        Color.createByTriangle(0.00, 1.0),
        Color.createByTriangle(0.05, 1.0),
        Color.createByTriangle(0.12, 1.0),
        Color.createByTriangle(0.2287, 1.0),
        Color.createByTriangle(0.56, 1.0),
        Color.createByTriangle(0.60, 1.0),
        Color.createByTriangle(0.65, 1.0)
    ];

    var bedroom = ["Temple 1", "Temple 2"];
    var temple = ["Temple 3", "Temple 4"];
    var office = ["Office W","Office E"];
    var livingRoom = ["Living Room W","Living Room E"];

    var rooms = [bedroom, livingRoom, office, temple];

    var all = temple.concat(office).concat(livingRoom);
    var allExcept = function(names) { return function(light) { return !_.contains(names, light.name); }; };
    var only = function(names) { return function(light) { return _.contains(names, light.name); }; };

    var hub;

    Hub.findAndConnect('10.0.1.', console.log, function(h) {
        hub = h;
        console.log('connected');
        nextColor();
    });

    var transitionTime = 500;
    var interval = 250;
    var wait = 2000;
    var roomIndex = 0;
    var colorIndex = 0;

    function nextColor() {
        roomIndex = 0;
        colorIndex = (colorIndex + 1) % rainbow.length;
        nextRoom();
    }

    function nextRoom() {

        // if we're out of rooms, go to the next color
        if (roomIndex == rooms.length) {
            setTimeout(nextColor, wait);
            return;
        }

        var state = State.create(true, 200, rainbow[colorIndex]);

        // otherwise set the room color
        var filter = only(rooms[roomIndex]);
        roomIndex += 1;
        hub.setState(state, filter, transitionTime, function() {
            setTimeout(nextRoom, interval);
        });

    }








});



