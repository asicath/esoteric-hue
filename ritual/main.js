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

    var rev12 = Handlebars.compile($("#rev12-template").html());
    var rev17 = Handlebars.compile($("#rev17-template").html());

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
    $('#main').html(rangesTemplate({ranges:['10.0.0.', '10.0.1.', '192.168.0.', '192.168.1.']}));

    $('input').on('click', function() {

        var range = $(this).val();

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
        text: "Full Light",
        execute: function() {
            var state = State.create(true, 255, Color.createByCT("norm", 370));
            setState(state);
        }
    });

    buttons.push({
        text: "Low Light Seating",
        execute: function() {
            var state = State.create(true, 128, Color.createByCT("norm", 370));
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

    $('#main').append('<div id="music">loading music...</div>');

    var songs = {
        haruNoUmi: {url: 'haru_no_umi.mp3'},
        mahakalaPuja: {url: 'mahakala_puja_crop.mp3'}
    };



    var music = {};

    for (var key in songs) {
        var song = songs[key];

        $('body').append('<audio id="' + key + '" load="auto" src="' + song.url + '" />');
        var obj = $('#' + key);

        //var obj = new Audio(song.url);
        //obj.load();
        //$(this).attr('src')
        obj.name = key;


        $(obj).bind('canplaythrough', function() {
            $('#main').append('<div>complete</div>');
        });

        $(obj).bind('progress', function(e) {



            $('#main').append('<div>progress:' + e.eventPhase + '</div>');
        });

        music[key] = obj;
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

        $('#main').html(rev12({}) + template(viewModel) + rev17({}));

        // add sound buttons
        $('.btnAbyss').after('<div class="music" data-name="haruNoUmi">Haru No Umi</div>');
        $('.btnAbyss').after('<div class="music" data-name="mahakalaPuja">Mahakala Puja</div>');


        $('.button').on('click', function() {

            $('.button').css('background-color', '');

            $(this).css('background-color', '#888');

            pressCount++;
            var index = $(this).data('index');
            var button = buttons[index];
            button.execute();
        });

        $('.music').on('click', function() {
            var name = $(this).data('name');
            var obj = music[name];

            if (typeof obj.playing == 'undefined') {
                obj.play();
                obj.playing = true;

            }
            else if (obj.playing) {
                obj.pause();
                //obj.currentTime = 0;
                obj.playing = false;
            }
            else {
                obj.play();
                obj.playing = true;
            }



        });

    }

    function log(msg) {
        $('#main').append(msg + "<br>");
        //console.log(msg);
    }

});
