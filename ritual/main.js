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


        $('#setColors').on('click', function() {

            var rad = $('.colorOption:checked');
            var chks = $('.lightOption:checked');

            // make sure both light and color are selected
            if (rad.length == 0 || chks.length == 0) return;

            // get the color
            var colorId = $(rad[0]).data('id');
            var color = colors[colorId];

            // get the brightness
            var bri = +$('#bri').val();

            // set each light to the specified color
            for (var i = 0; i < chks.length; i++) {

                // get the light
                var lightId = $(chks[i]).data('id');
                var light = hub.lights[lightId];

                // create and set the state
                var state = State.create(true, bri, color);
                light.setState({state: state});
            }

        });

        $('#turnOff').on('click', function() {

            var chks = $('.lightOption:checked');

            if (chks.length == 0) return;

            for (var i = 0; i < chks.length; i++) {
                var lightId = $(chks[i]).data('id');
                var light = hub.lights[lightId];

                var state = State.create(false, null, null);
                light.setState({state: state});
            }

        });

    }

    function log(msg) {
        //$('body').append(msg + "<br>");
        console.log(msg);
    }



});
