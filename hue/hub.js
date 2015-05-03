define(['http-active'], function(http) {

    var exports = {};

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
    // used to support find hub
    var checkIp = function(ip, success, fail) {

        http.post(ip, '/api', {
            devicetype: "app",
            username: username
        }, function() {
            // return the ip on success
            success(ip);
        }, function() {
            fail(ip);
        });

    };


    // create a hub object
    exports.create = function(ip, success, fail, onNeedToPressButton) {

        var hub = {};

        var devicetype = "esoterichue#devicename"; // 0-20 # 0-19 max 40
        var username = 'esoteric100002';   // 10-40

        // it should first try to get configuration, might fail for user

        var getFullState = function() {
            http.get(ip, '/api/' + username, null, function(data) {

            }, function() {

            });
        };

        hub.createUser = function(ip, success, fail, onNeedToPressButton) {

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
            http.post(ip, '/api', {
                devicetype: devicetype,
                username: username
            }, function(data) {

                // check the msg
                if (data.length && data[0].error) {
                    if (data[0].error.type == 101) {
                        onNeedToPressButton();
                    }
                    else {
                        fail(data[0].error);
                    }
                }
                else {
                    success();
                }

            });
        };

        hub.getLights = function(ip, success, fail) {
            http.get(ip, '/api/' + username + '/lights', null, function(data) {
                var x = data;
            }, function() {

            });
        };

        return hub;
    };

    return exports;
});