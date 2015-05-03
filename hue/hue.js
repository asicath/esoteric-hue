define(['hue/http-hue'], function(http) {

    var exports = {};

    var devicetype = "esoterichue#devicename"; // 0-20 # 0-19 max 40
    var username = 'esoteric10000';   // 10-40

    // search a range of IP address for a hue hub
    exports.findHub = function(range, success, fail) {
        var errorCount = 0;
        var number = 0;
        var maxNumber = 0;
        var found = false;
        var next = function() {
            maxNumber += 5;
            while (number < maxNumber && number < 255) {

                // get the next IP
                var targetIp = range + number;

                // attempt to connect
                checkIp(targetIp,
                    function(ip) {
                        found = true;
                        // pass it up the chain
                        success(ip);
                    },
                    // failure
                    function() {
                        // no need if found on another thread
                        if (found) return;

                        errorCount++;
                        if (errorCount == 255) {
                            fail("Could not find hub on range: " + range);
                        }
                        else if (errorCount == maxNumber) {
                            next();
                        }
                    }
                );
                number++;
            }

        };

        next();
    };

    // do a simple create user call to see if the ip is a hue hub
    var checkIp = function(ip, success, fail) {

        http.get(ip, '/api/' + username, null, function() {
            // return the ip on success
            success(ip);
        }, function(e) {

            // just means unauthorized user
            if (e.length && e[0].error && e[0].error.type == 1) {
                success(ip);
            }
            else {
                fail(ip);
            }
        });

    };



    exports.createUser = function(ip, success, fail, onNeedToPressButton) {

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

    var createUser = function(ip, success, fail, onNeedToPressButton) {
        http.post(
            ip,
            '/api',
            {
                devicetype: devicetype,
                username: username
            },

            // success
            function(data) {
                success(data);
            },

            // fail
            function(e) {

                // handle press link button events gracefully
                if (e.length && e[0].error && e[0].error.type == 101) {
                    onNeedToPressButton();
                }

                // otherwise just pass it up
                else {
                    fail(e);
                }
            }
        );
    };

    exports.getLights = function(ip, success, fail) {
        http.get(ip, '/api/' + username + '/lights', null, function(data) {
            var x = data;
        }, function() {

        });
    };





    return exports;
});