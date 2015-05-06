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
    'hue/color'
], function(
    Hub,
    Color
) {

    var ip;

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

        // show the lights
        for (var id in hub.lights) {
            var light = hub.lights[id];
            var chk = $('<input type="checkbox" id="chkLight-' + light.id + '" class="lightOption" data-id="' + light.id + '" /><label for="chkLight-' + light.id + '">' + light.name + '</label>');
            chk.data('light', light);

            var div = $('<div>').append(chk);

            $('#lights').append(div);
        }

        // show the colors
        var colors = {};
        colors.red = Color.RED;
        colors.blue = Color.BLUE;

        for (var key in colors) {
            var color = colors[key];

            var rad = $('<input type="radio" name="color" class="colorOption" id="chkColor-' + color.name + '" /><label for="chkColor-' + color.name + '">' + color.name + '</label>');
            rad.data('color', color);

            var div = $('<div>').append(rad);

            $('#colors').append(div);
        }

        $('#setColors').on('click', function() {

            var rad = $('.colorOption:checked');
            var chks = $('.lightOption:checked');

            if (rad.length == 0 || chks.length == 0) return;

            var color = $(rad[0]).data('color');
            var bri = +$('#bri').val();

            for (var i = 0; i < chks.length; i++) {
                var light = $(chks[i]).data('light');
                hub.lights[light.name].setState(true, bri, color);
            }

        });

        $('#turnOff').on('click', function() {

            var chks = $('.lightOption:checked');

            if (chks.length == 0) return;

            for (var i = 0; i < chks.length; i++) {
                var light = $(chks[i]).data('light');
                hub.lights[light.name].setState(false, null, null);
            }

        });


        /*
        hub.lights['Living Room W'].setState(true, null, red);
        hub.lights['Living Room E'].setState(true, null, blue);

        setTimeout(function() {
            hub.lights['Living Room W'].setState(false, null, null);
            hub.lights['Living Room E'].setState(false, null, null);
        }, 1000);
        */
    }

    function log(msg) {
        //$('body').append(msg + "<br>");
        console.log(msg);
    }



});
