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
    'hue/hue'
], function(
    Hue
) {

    searchAndConnect(function() {}, function() {});


    function log(msg) {
        $('body').append(msg + "<br>");
    }


    function searchAndConnect(success, fail) {
        log('searching for hub...');

        Hue.findHub('10.0.0.', function(ip) {

            log('hub found: ' + ip + ", connecting...");

            Hue.connect(
                ip,
                // successful connect
                function() {
                    log('connection successful');
                    success();
                },
                // fail
                function() {
                    fail();
                },
                // need to press button
                function() {
                    log('press link button');
                }
            );

        }, function() {

        });
    }





});
