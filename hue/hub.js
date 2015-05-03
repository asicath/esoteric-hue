define(['http-active'], function(http) {

    var exports = {};

    // 0-20 # 0-19 max 40
    var devicetype = "esoterichue#devicename";

    // 10-40
    var username = 'esoteric10000';

    // search a range of IP address for a hue hub
    exports.find = function(range, success, fail) {
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

        init();

        // init the hub object by first getting configuration and instantiating objects
        // might need to ask to press the link button
        function init() {
            getFullState(
                // on success give the hub back
                function(data) {
                    // on success, create hue objects
                    
                    hub.connectState = data;

                    success(hub);
                },
                // fail just return the error
                function(e) {
                    fail(e);
                },

                // need to create user
                function() {

                    // send the event up
                    onNeedToPressButton();

                    // then wait for press
                    waitForButtonPress(
                        init, // re init on successful creation of user
                        fail  // otherwise its just a fail
                    );
                }
            );
        }

        function getFullState(success, fail, onNeedToCreateUser) {
            http.get(
                ip,
                '/api/' + username,
                null,

                function(data) {
                    success(data); // just for now pass back the raw data
                },

                // otherwise catch the need to create user error
                function(e) {

                    if (e.length && e[0].error && e[0].error.type == 101) {
                        onNeedToCreateUser();
                    }
                    else {
                        fail(e);
                    }
                }
            );
        }

        function waitForButtonPress(success, fail) {

            function tryCreate() {
                // now try to create user
                createUser(success, fail, function () {
                    // try again soon
                    setTimeout(tryCreate, 300);
                });
            }

            tryCreate();
        }

        function createUser(success, fail, onNeedToPressButton) {
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
        }

    };

    return exports;
});