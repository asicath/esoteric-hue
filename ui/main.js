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

    var hub;

    function onConnect(hubb) {
        hub = hubb;
        log('connection successful');
        //log(JSON.stringify(hub));

        // success, show all the lights

        for (var id in hub.lights) {
            log(hub.lights[id].name);
        }


        var viewModel = {
            lights: hub.lights
        };

        $('body').html(template(viewModel));

        drawMap();

    }



    function drawMap() {

        var canvas = document.getElementById('colorCircle');
        var ctx = canvas.getContext('2d');

        var center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };

        var margin = 20;
        var radius = Math.min(center.x, center.y) - margin;




        var colorMap = [
            {r: 255, g:   0, b:   0, p: 0.00}, // red
            {r: 255, g:  96, b:   0, p: 0.05}, // orange
            {r: 255, g: 255, b:   0, p: 0.12}, // yellow
            {r:   0, g: 255, b:   0, p: 0.2287}, // green
            {r:   0, g:   0, b: 255, p: 0.60}, // blue
            {r: 255, g:   0, b: 255, p: 0.65} // purple
        ];

        // lines
        var p, c0, c1, c, percent, sat, i, angle;

        var levels = 6*12;
        var colorSegments = 6*12;

        for (var l = 0; l < levels; l++) {

            // modify for brightness
            sat = (levels - l) / levels;

            for (i = 0; i < 6; i++) {

                angle = ((Math.PI / 3) * i + Math.PI * 1.5) % (Math.PI * 2);

                // the colors


                var angleIncr = (Math.PI / 3) / colorSegments;
                var angleStart = angle - angleIncr / 2;

                c0 = colorMap[i];
                c1 = colorMap[(i + 1) % 6];

                for (var j = 0; j < colorSegments; j++) {

                    // determine color
                    percent = j / (colorSegments + 1);

                    c = {
                        r: (c1.r - c0.r) * percent + c0.r,
                        g: (c1.g - c0.g) * percent + c0.g,
                        b: (c1.b - c0.b) * percent + c0.b
                    };

                    c.r = Math.floor(c.r + (255 - c.r) * (1 - sat));
                    c.g = Math.floor(c.g + (255 - c.g) * (1 - sat));
                    c.b = Math.floor(c.b + (255 - c.b) * (1 - sat));

                    ctx.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';

                    // now all the points
                    var a0 = angleStart + angleIncr * j;
                    var a1 = a0 + angleIncr * 1.1;
                    var r = radius * sat;

                    p = {
                        x: Math.cos(a0) * r + center.x,
                        y: Math.sin(a0) * r + center.y
                    };

                    ctx.beginPath();
                    ctx.moveTo(center.x, center.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.arc(center.x, center.y, r, a0, a1);
                    ctx.closePath();
                    ctx.fill();

                }

            }
        }


        // lines
        for (i = 0; i < 6; i++) {

            angle = ((Math.PI / 3) * i + Math.PI * 1.5) % (Math.PI * 2);

            // now the black line
            p = {
                x: Math.cos(angle) * (radius + margin) + center.x,
                y: Math.sin(angle) * (radius + margin) + center.y
            };

            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

        }

        // circle
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2*Math.PI);
        ctx.stroke();

        // 0-1 F0F F00 Red
        // 1-2 F00 F80 Orange
        // 2-3 F80 FF0 Yellow
        // 3-4 FF0 0F0 Green
        // 4-5 0F0 00F Blue
        // 5-0 00F F0F

        $(canvas).on('click', function(e) {
            var p = {
                x: e.offsetX,
                y: e.offsetY
            };

            var a = Math.PI * 2 - (Math.atan2(p.x - center.x, p.y - center.y) + Math.PI);
            var percent = a / (Math.PI * 2);

            i = Math.floor(percent * 6) % 6;
            c0 = colorMap[i];
            c1 = colorMap[(i + 1) % 6];

            var range = (i==5) ? 1.0 - c0.p : c1.p - c0.p;

            var colorPercent = (percent * 6 - i) * range + c0.p;

            var d = Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2));
            var sat = Math.min(1, d / radius);

            var color = Color.createByTriangle('', colorPercent, sat);



            setColors(color);
        });

    }

    function setColors(color, brightness) {

        var lights = getSelectedLights();

        // make sure both light and color are selected
        if (lights.length == 0) return;

        // get the brightness
        var bri = 255;

        // set each light to the specified color
        for (var i = 0; i < lights.length; i++) {

            // get the light
            var light = lights[i];

            // create and set the state
            var state = State.create(true, bri, color);
            light.setState({state: state, transitionTime: 1000});
        }
    }

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


    function log(msg) {
        //$('body').append(msg + "<br>");
        console.log(msg);
    }



});
