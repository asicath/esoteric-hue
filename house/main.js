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

    var rainbow = {
        red: State.create(true, 245, Color.createByTriangle("red", 0.00, 1.0)),
        orange: State.create(true, 254, Color.createByTriangle("orange", 0.05, 1.0)),
        yellow: State.create(true, 254, Color.createByTriangle("yellow", 0.12, 1.0)),
        green: State.create(true, 150, Color.createByTriangle("green", 0.2287, 1.0)),
        blue: State.create(true, 254, Color.createByTriangle("blue", 0.56, 1.0)),
        indigo: State.create(true, 150, Color.createByTriangle("indigo", 0.60, 1.0)),
        violet: State.create(true, 254, Color.createByTriangle("violet", 0.65, 1.0))
    };

    rainbow.red.planet = 'Mars';
    rainbow.orange.planet = 'Sol';
    rainbow.yellow.planet = 'Mercury';
    rainbow.green.planet = 'Venus';
    rainbow.blue.planet = 'Luna';
    rainbow.indigo.planet = 'Saturn';
    rainbow.violet.planet = 'Jupiter';

    // now find the hub
    //
    $('#main').html(rangesTemplate({ranges:['10.0.0.', '10.0.1.', '192.168.0.', '192.168.1.']}));

    $('input').on('click', function() {

        var range = $(this).val();

        if (range == "SKIP") {
            onConnect({});
            return;
        }

        $('#main').html('Looking for hub on ' + range + '*');

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

    var mainColored = [
        "Temple 1", "Temple 2","Office W","Office E","Living Room W","Living Room E",
        "Center 1", "Center 2", "Center 3"
    ];

    var east = [
        "Temple 1", "Temple 2",
        "Center 1"
    ];

    var center = [
        "Office W","Office E",
        "Center 2"
    ];

    var west = [
        "Living Room W","Living Room E",
        "Center 3"
    ];

    for (var c in rainbow) {
        (function(colorName) {
            buttons.push({
                text: rainbow[colorName].planet,
                execute: function() {
                    setState(rainbow[colorName], onlyFilter(center.concat((west))));
                }
            });
        })(c);
    }



    function onConnect(foundHub) {
        log('connection successful');

        // store for later
        hub = foundHub;

        // assign the buttons indexes
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].index = i;
            buttons[i].class = 'btn' + buttons[i].text.replace(/ /g, '');
        }

        var viewModel = {
            buttons: buttons
        };

        $('#main').html(template(viewModel));

        $('.button').on('click', function() {

            $('.button').css('background-color', '');

            $(this).css('background-color', '#888');

            pressCount++;
            var index = $(this).data('index');
            var button = buttons[index];
            button.execute();
        });

    }

    function log(msg) {
        $('#main').append(msg + "<br>");
        //console.log(msg);
    }

});
