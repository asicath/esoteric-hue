requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
        'http-active': 'hue/http-web'
    }
});

requirejs([
    'hue/hub',
    'hue/color',
    'hue/state',
    'handlebars'
], function(
    Hub,
    Color,
    State,
    Handlebars
) {

    var ip, hub;

    // handlebars
    var template = Handlebars.compile($("#main-template").html());

    var rangesTemplate = Handlebars.compile($("#ranges-template").html());

    // load the colors
    //var colors = {};
    //colors[Color.RED.id] = Color.RED;
    //colors[Color.GREEN.id] = Color.GREEN;
    //colors[Color.BLUE.id] = Color.BLUE;

    var rainbowStates = {
        red: State.create(true, 245, Color.createByTriangle("red", 0.00, 1.0)),
        orange: State.create(true, 255, Color.createByTriangle("orange", 0.05, 1.0)),
        yellow: State.create(true, 255, Color.createByTriangle("yellow", 0.12, 1.0)),
        green: State.create(true, 150, Color.createByTriangle("green", 0.2287, 1.0)),
        blue: State.create(true, 255, Color.createByTriangle("blue", 0.56, 1.0)),
        indigo: State.create(true, 150, Color.createByTriangle("indigo", 0.60, 1.0)),
        violet: State.create(true, 255, Color.createByTriangle("violet", 0.65, 1.0))
    };

    // now find the hub
    //
    $('body').html(rangesTemplate({ranges:['10.0.0.', '10.0.1.', '192.168.0.', '192.168.1.']}));

    $('input').on('click', function() {

        var range = $(this).val();

        $('body').html('Looking for hub on ' + range + '*');

        findAndConnect(range);
    });

    function findAndConnect(range) {
        log('searching for hub...');

        Hub.find(
            range,
            function (foundIp) {
                log('hub found: ' + foundIp + ", connecting...");
                ip = foundIp;

                Hub.create(
                    ip,
                    onConnect,
                    function(e) {
                        log(JSON.stringify(e));
                    },
                    function() {
                        log('press link button');
                    }
                );
            },
            function (e) {
                log(e);
            }
        );

    }

    var allExceptFilter = function(names) {
        return function(light) {
            return !_.contains(names, light.name);
        };
    };

    var onlyFilter = function(names) {
        return function(light) {
            return _.contains(names, light.name);
        };
    };

    var setState = function(state, filter, transitionTime) {

        // if no filter, just set them all
        if (!filter) filter = function(light) {return true;};

        var lights = [];

        for (var id in hub.lights) {
            lights.push(hub.lights[id]);
        }

        lights = _.filter(lights, filter);

        if (typeof transitionTime === 'undefined') transitionTime = 1000;

        for (var i = 0; i < lights.length; i++) {
            lights[i].setState({state: state, transitionTime:transitionTime});
        }
    };

    var pressCount = 0;
    var buttons = [];

    var all = [
        "Temple 1", "Temple 2", "Living Room W", "Living Room E", "Office W", "Office E",
        "Center 1", "Center 2", "Center 3", "West 1", "West 2", "West 3", "West 4", "East 1", "East 2", "East 3", "East 4"
    ];
    var justLux = [
        "Living Room W", "Living Room E", "Office W", "Office E",
        "West 1", "West 2", "West 3", "West 4", "East 1", "East 2", "East 3", "East 4"
    ];
    var mainColored = [
        "Temple 1", "Temple 2",
        "Center 1", "Center 2", "Center 3"
    ];
    var altar = [
        "Temple 1",
        "Center 1"
    ];
    var nonAltar = [
        "Temple 2",
        "Center 2", "Center 3"
    ];

    buttons.push({
        text: "Low Light Seating",
        execute: function() {
            var state = State.create(true, 128, Color.createByCT("norm", 497));
            setState(state);
        }
    });

    buttons.push({
        text: "Opening",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(altar));

            var bright = State.create(true, 255, Color.createByCT("white", 153));
            setState(bright, onlyFilter(altar));
        }
    });



    buttons.push({
        text: "Dragon Chase",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = State.create(true, 128, Color.createByTriangle("red", 0.00, 1.0));
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Luna",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.blue;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Mercury",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.yellow;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Venus",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.green;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Sol",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.orange;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Mars",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.red;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Jupiter",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.violet;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Saturn",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(mainColored));

            var bright = rainbowStates.indigo;
            setState(bright, onlyFilter(mainColored));
        }
    });

    buttons.push({
        text: "Abyss",
        execute: function() {
            var off = State.create(false, null, null);
            setState(off);
        }
    });

    var rainbowArray = [
        State.create(true, 245, Color.createByTriangle("red", 0.00, 1.0)),
        State.create(true, 255, Color.createByTriangle("orange", 0.05, 1.0)),
        State.create(true, 255, Color.createByTriangle("yellow", 0.12, 1.0)),
        State.create(true, 150, Color.createByTriangle("green", 0.2287, 1.0)),
        State.create(true, 255, Color.createByTriangle("blue", 0.56, 1.0)),
        State.create(true, 150, Color.createByTriangle("indigo", 0.60, 1.0)),
        State.create(true, 255, Color.createByTriangle("violet", 0.65, 1.0))
    ];

    buttons.push({
        text: "Rainbow",
        execute: function() {

            // turn others off
            var off = State.create(false, null, null);
            setState(off, allExceptFilter(altar));

            var press = pressCount;
            var index = 5;

            function next() {
                // stop on the next press
                if (press != pressCount) return;

                var state = rainbowArray[index];
                setState(state, onlyFilter(altar), 2000);

                index = (index + 1) % 7;

                setTimeout(next, 2000);
            }

            next();
        }
    });


    function onConnect(foundHub) {
        log('connection successful');

        // store for later
        hub = foundHub;

        // assign the buttons indexes
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].index = i;
        }

        var viewModel = {
            buttons: buttons
        };

        $('body').html(template(viewModel));

        $('.button').on('click', function() {
            pressCount++;
            var index = $(this).data('index');
            var button = buttons[index];
            button.execute();
        });

    }

    function log(msg) {
        $('body').append(msg + "<br>");
        //console.log(msg);
    }



});






/*
 $('.colorButton').on('click', setColor);
 $('#turnOff').on('click', turnOff);
 $('#chase').on('click', chase);

 function getSelectedLights() {

 var chks = $('.lightOption:checked');

 var a = [];

 // set each light to the specified color
 for (var i = 0; i < chks.length; i++) {

 // get the light
 var lightId = $(chks[i]).data('id');
 var light = hub.lights[lightId];

 a.push(light);
 }

 return a;
 }

 function setColor() {

 chasing = false; //make sure

 var lights = getSelectedLights();

 // make sure both light and color are selected
 if (lights.length == 0) return;

 var stateIndex = $(this).data('index');
 var state = rainbowStates[stateIndex];

 // set each light to the specified color
 for (var i = 0; i < lights.length; i++) {

 // get the light
 var light = lights[i];

 // create and set the state
 light.setState({state: state, transitionTime:300});
 }
 }

 function turnOff() {
 chasing = false; //make sure

 var lights = getSelectedLights();
 if (lights.length == 0) return;
 for (var i = 0; i < lights.length; i++) {
 var light = lights[i];
 var state = State.create(false, null, null);
 light.setState({state: state});
 }
 }

 var rainbow = [
 State.create(true, 245, Color.createByTriangle("red", 0.00, 1.0)),
 State.create(true, 255, Color.createByTriangle("orange", 0.05, 1.0)),
 State.create(true, 255, Color.createByTriangle("yellow", 0.12, 1.0)),
 State.create(true, 150, Color.createByTriangle("green", 0.2287, 1.0)),
 State.create(true, 255, Color.createByTriangle("blue", 0.56, 1.0)),
 State.create(true, 150, Color.createByTriangle("indigo", 0.60, 1.0)),
 State.create(true, 255, Color.createByTriangle("violet", 0.65, 1.0))
 ];

 var chasing = false;

 function chase() {
 var lights = getSelectedLights();
 if (lights.length == 0) return;

 var index = 0;
 var transition = +$('#transition').val();
 var transitionTime = transition * 0.9;


 chasing = true;

 function next() {

 // find stop condition
 if (!chasing) return;

 var state = rainbow[index];

 for (var i = 0; i < lights.length; i++) {
 var light = lights[i];

 light.setState({state: state, transitionTime:transitionTime});
 }

 // setup for next round
 index = index < (rainbow.length-1) ? index + 1 : 0;

 setTimeout(next, transition);
 }

 next();
 }
 */