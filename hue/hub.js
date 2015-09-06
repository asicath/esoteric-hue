define(['hue/http-hue', 'hue/light', 'lodash'], function(http, Light, _) {

    var exports = {};

    // 0-20 # 0-19 max 40
    var devicetype = "esoterichue#devicename";

    // 10-40
    var username = 'xxesoteric10000';

    // search a range of IP address for a hue hub
    exports.find = function(range, success, fail) {
        var errorCount = 0;
        var number = 0;
        var maxNumber = 0;
        var found = false;
        var xhr = {};
        var next = function() {
            maxNumber += 40;
            while (number < maxNumber && number < 255) {

                // get the next IP
                var targetIp = range + number;

                // attempt to connect
                xhr[targetIp] = checkIp(targetIp,
                    function(ip) {
                        found = true;

                        // cancel all the others
                        for (var key in xhr) {
                            if (key == ip || !xhr[key]) continue;
                            http.abort(xhr[key]);
                        }

                        // pass it up the chain
                        success(ip);
                    },
                    // failure
                    function(ip) {
                        // no need if found on another thread
                        if (found) return;

                        xhr[ip] = false;

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

        return http.post({
            host: ip,
            path: '/api',
            data: {
                devicetype: devicetype,
                username: username
            },
            success: function(data) {
                success(ip);
            },
            fail: function(e) {
                // check the msg
                if (e.length && e[0].error) {
                    if (e[0].error.type == 101) {
                        success(ip); // user not created
                    }
                    else {
                        fail(ip);
                    }
                }
                fail(ip);
            }
        });

    };

    exports.createTest = function() {
        var hub = {
            lights: {}
        };

        hub.setLightState = function(o) { };

        // create fake lights
        for (var id = 1; id < 5; id++) {
            var light = Light.create(hub, id, {
                name: 'light ' + id,
                state: {
                    "on":false,
                    "bri":1,
                    "colormode":"ct",
                    "xy":[0.5115,0.415],
                    "ct":463,
                    "hue":13162,
                    "sat":211,
                    "effect":"none",
                    "alert":"none",
                    "reachable":true
                }
            });

            hub.lights[light.name] = light;
        }

        return hub;
    };

    // create a hub object
    exports.create = function(ip, success, fail, onNeedToPressButton) {

        var hub = {
            lights: {}
        };

        init();

        // init the hub object by first getting configuration and instantiating objects
        // might need to ask to press the link button
        function init() {
            getFullState(
                // on success give the hub back
                function() {
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
            http.get({
                host: ip,
                path: '/api/' + username,

                success: function (data) {
                    // on success, create hue objects

                    for (var id in data.lights) {
                        var light = Light.create(hub, id, data.lights[id]);
                        hub.lights[light.id] = light;
                        //hub.lights[light.name] = light;
                    }

                    // for now just store the state
                    //hub.connectState = data;

                    success();
                },

                // otherwise catch the need to create user error
                fail: function (e) {

                    if (e.length && e[0].error && e[0].error.type == 1) {
                        onNeedToCreateUser();
                    }
                    else {
                        fail(e);
                    }
                }
            });
        }

        hub.getLightByName = function(name) {
            for (var id in hub.lights) {
                if (hub.lights[id].name == name) return hub.lights[id];
            }
            return null;
        };

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
            http.post({
                host: ip,
                path: '/api',
                data: {
                    devicetype: devicetype,
                    username: username
                },
                success: function(data) {
                    success();
                },
                fail: function(e) {
                    // check the msg
                    if (e.length && e[0].error) {
                        if (e[0].error.type == 101) {
                            onNeedToPressButton();
                        }
                        else {
                            fail(e[0].error);
                        }
                    }
                    else {
                        fail(e);
                    }

                }
            });
        }

        hub.setLightState = function(o) {
            http.put({
                host: ip,
                path: '/api/' + username + '/lights/' + o.id + '/state',
                data: o.data,
                success: o.success,
                fail: o.fail
            });
        };

        hub.getLightState = function(o) {
            http.get({
                host: ip,
                path: '/api/' + username + '/lights/' + o.id,
                success: o.success,
                fail: o.fail
            });
        };

        hub.setState = function(state, filter, transitionTime, after) {

            // if no filter, just set them all
            if (!filter) filter = function(light) {return true;};

            var lights = [];

            for (var id in hub.lights) {
                lights.push(hub.lights[id]);
            }

            lights = _.filter(lights, filter);

            if (typeof transitionTime === 'undefined') transitionTime = 1000;

            var completed = 0;
            var waitForAllToComplete = function() {
                completed++;
                if (completed == lights.length) {
                    if (after) after();
                }
            };

            for (var i = 0; i < lights.length; i++) {
                lights[i].setState({state: state, transitionTime:transitionTime, success:waitForAllToComplete });
            }
        };

    };

    exports.findAndConnect = function(range, log, onConnect) {
        log('searching for hub...');

        exports.find(
            range,
            function (foundIp) {
                log('hub found: ' + foundIp + ", connecting...");
                var ip = foundIp;

                exports.create(
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

    };


    return exports;
});