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

    // load the colors
    var colors = {};
    colors[Color.RED.id] = Color.RED;
    colors[Color.GREEN.id] = Color.GREEN;
    colors[Color.BLUE.id] = Color.BLUE;

    // now find the hub
    findAndConnect('10.0.0.');

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
            colors: colors
        };

        $('body').html(template(viewModel));

        $('#setColors').on('click', setColors);
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

        function setColors() {

            var lights = getSelectedLights();

            var rad = $('.colorOption:checked');

            // make sure both light and color are selected
            if (rad.length == 0 || lights.length == 0) return;

            // get the color
            var colorId = $(rad[0]).data('id');
            var color = colors[colorId];

            // get the brightness
            var bri = +$('#bri').val();

            // set each light to the specified color
            for (var i = 0; i < lights.length; i++) {

                // get the light
                var light = lights[i];

                // create and set the state
                var state = State.create(true, bri, color);
                light.setState({state: state});
            }
        }

        function turnOff() {
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



        function chase() {
            var lights = getSelectedLights();
            if (lights.length == 0) return;

            var index = 0;

            function next() {
                var state = rainbow[index];

                for (var i = 0; i < lights.length; i++) {
                    var light = lights[i];

                    light.setState({state: state, transitionTime:9000});
                }

                // setup for next round
                index = index < (rainbow.length-1) ? index + 1 : 0;

                setTimeout(next, 10000);
            }

            next();
        }

    }

    function log(msg) {
        //$('body').append(msg + "<br>");
        console.log(msg);
    }



});
