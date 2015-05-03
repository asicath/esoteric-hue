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
    'hue/color-xy'
], function(
    Hub,
    ColorXY
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

        /*
         r: {x: 0.674, y: 0.322},    // Lower right
         g: {x: 0.408, y: 0.517},    // Upper center
         b: {x: 0.168, y: 0.041}     // Lower left
         */

        var red = ColorXY.create(0.674, 0.322);
        var blue = ColorXY.create(0.168, 0.041);

        hub.lights['Living Room W'].setState(true, null, red);
        hub.lights['Living Room E'].setState(true, null, blue);

        setTimeout(function() {
            hub.lights['Living Room W'].setState(false, null, null);
            hub.lights['Living Room E'].setState(false, null, null);
        }, 1000);
    }

    function log(msg) {
        $('body').append(msg + "<br>");
    }



});
