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

    var ip;

    // handlebars
    var template = Handlebars.compile($("#main-template").html());

    var rangesTemplate = Handlebars.compile($("#ranges-template").html());

    // load the colors
    //var colors = {};
    //colors[Color.RED.id] = Color.RED;
    //colors[Color.GREEN.id] = Color.GREEN;
    //colors[Color.BLUE.id] = Color.BLUE;

    var rainbowStates = [
        State.create(true, 245, Color.createByTriangle(0.00, 1.0)),
        State.create(true, 255, Color.createByTriangle(0.05, 1.0)),
        State.create(true, 255, Color.createByTriangle(0.12, 1.0)),
        State.create(true, 150, Color.createByTriangle(0.2287, 1.0)),
        State.create(true, 255, Color.createByTriangle(0.56, 1.0)),
        State.create(true, 150, Color.createByTriangle(0.60, 1.0)),
        State.create(true, 255, Color.createByTriangle(0.65, 1.0))
    ];

    for (var j = 0; j < rainbowStates.length; j++) {
        rainbowStates[j].index = j;
    }

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

    function onConnect(hub) {
        log('connection successful');
        //log(JSON.stringify(hub));

        // success, show all the lights

        for (var id in hub.lights) {
            log(hub.lights[id].name);
        }


        var viewModel = {
            lights: hub.lights,
            states: rainbowStates
        };

        $('body').html(template(viewModel));

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
            State.create(true, 245, Color.createByTriangle(0.00, 1.0)),
            State.create(true, 255, Color.createByTriangle(0.05, 1.0)),
            State.create(true, 255, Color.createByTriangle(0.12, 1.0)),
            State.create(true, 150, Color.createByTriangle(0.2287, 1.0)),
            State.create(true, 255, Color.createByTriangle(0.56, 1.0)),
            State.create(true, 150, Color.createByTriangle(0.60, 1.0)),
            State.create(true, 255, Color.createByTriangle(0.65, 1.0))
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

    }

    function log(msg) {
        $('body').append(msg + "<br>");
        //console.log(msg);
    }



});
