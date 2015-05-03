define(['http-active'], function(http) {

    var exports = {};

    var username = 'asicath12345';

    // search a range of IP address for a hue hub
    exports.findHub = function(range, success, fail) {
        var number = 0;
        var errorCount = 0;
        while (number < 255) {
            var targetIp = range + number;
            checkIp(targetIp,
                function(ip) {
                    // pass it up
                    success(ip);
                },
                // failure
                function() {
                    errorCount++;
                    if (errorCount == 255) {
                        fail("Could not find hub on range: " + range);
                    }
                }
            );
            number++;
        }
    };

    exports.connect = function(ip, success, fail, onNeedToPressButton) {

        var sentEvent = false;

        function tryCreate() {
            // now try to create user
            createUser(ip, success, fail, function () {

                // try again in 100ms
                setTimeout(tryCreate, 300);

                // send the event up once
                if (!sentEvent) {
                    sentEvent = true;
                    onNeedToPressButton();
                }
            });
        }

        tryCreate();

    };


    // do a simple create user call to see if the ip is a hue hub
    var checkIp = function(ip, success, fail) {

        http.post(ip, '/api', {
            devicetype: "app",
            username: "esoterichue"
        }, function() {
            // return the ip on success
            success(ip);
        }, function() {
            fail(ip);
        });

    };

    var createUser = function(ip, success, fail, onNeedToPressButton) {
        http.post(ip, '/api', {
            devicetype: "app",
            username: "esoterichue#devicename"
        }, function(data) {

            // check the msg
            if (data.length && data[0].error && data[0].error.type == 1) {
                onNeedToPressButton();
            }
            else {
                success();
            }

        });
    };

    return exports;
});