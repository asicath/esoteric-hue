define(function() {

    var exports = {};

    exports.create = function(hub, id, info) {
        var light = {};

        light.id = id;
        light.name = info.name;
        light.state = info.state;
        light.modelid = info.modelid; // LCT001 Extended color light //LWB004 Dimmable light

        light.setState = function(o) {

            // get the full data object
            var raw = o.state.getDataObject();

            // crop data down to just changes for better performance
            var data = {};
            var nextState = {};
            var hasChange = false;

            if (typeof raw.on !== "undefined" && raw.on != light.state.on) {
                data.on = raw.on;
                nextState.on = raw.on;
            }
            else {
                nextState.on = light.state.on;
            }

            if (typeof raw.bri !== "undefined" && raw.bri != light.state.bri) {
                data.bri = raw.bri;
                nextState.bri = raw.bri;
            }
            else {
                nextState.bri = light.state.bri;
            }

            if (typeof raw.xy !== "undefined") {
                nextState.colormode = "xy";
                if (light.state.colormode != "xy" || light.state.xy[0] != raw.xy[0] || light.state.xy[1] != raw.xy[1]) {
                    data.xy = raw.xy;
                    nextState.xy = raw.xy;
                }
                else {
                    nextState.xy = light.state.xy;
                }
            }
            else if (typeof raw.ct !== "undefined") {
                nextState.colormode = "ct";
                if (light.state.colormode != "ct" || light.state.ct != raw.ct) {
                    data.ct = raw.ct;
                    nextState.ct = raw.ct;
                }
                else {
                    nextState.ct = light.state.ct;
                }
            }
            else if (typeof raw.hue !== "undefined") {
                nextState.colormode = "hs";
                if (light.state.colormode != "hs" || light.state.hue != raw.hue || light.state.sat != raw.sat) {
                    data.hue = raw.hue;
                    data.sat = raw.sat;
                    nextState.hue = raw.hue;
                    nextState.sat = raw.sat;
                }
                else {
                    nextState.hue = light.state.hue;
                    nextState.sat = light.state.sat;
                }
            }

            // no call needed
            if (isEmptyObject(data)) {
                light.state = nextState;
                if (o.success) o.success();
                return;
            }

            // add in the transitionTime
            var transitionTime = o.transitionTime || 0; // default to 0
            data.transitiontime = transitionTime / 100; // called out in 100ms periods

            setStateAndVerify({
                data: data,
                nextState: nextState,
                success: o.success,
                fail: o.fail
            }, 2);

        };

        function setStateAndVerify(o, attempts) {

            if (!attempts) {
                console.log('Too many attempts');

                if (o.fail) o.fail();
                return;
            }

            // now make the call
            hub.setLightState({
                id: id,
                data: o.data,
                success: function() {

                    // now verify state
                    hub.getLightState({id:id, success: function(e) {

                        for (var key in o.data) {

                            // ignore transition time
                            if (key == 'transitiontime') continue;

                            // light does not support that attribute
                            if (typeof e.state[key] === 'undefined') continue;

                            if (key == 'xy') {
                                if (
                                    Math.floor(e.state.xy[0] * 1000) == Math.floor(o.data.xy[0] * 1000) &&
                                    Math.floor(e.state.xy[1] * 1000) == Math.floor(o.data.xy[1] * 1000)
                                ) continue;
                            }
                            else if (e.state[key] == o.data[key]) continue;

                            // fail
                            console.log('setState did not take, retrying...');
                            console.log(o.data);
                            console.log(e.state);


                            setTimeout(function() {
                                setStateAndVerify(o, attempts - 1);
                            }, 500);

                        }

                        // its all good, save the state and move on
                        light.state = o.nextState;
                        if (o.success) o.success();
                    }});

                },
                fail: o.fail
            });
        }

        return light;
    };

    function isEmptyObject(obj) {
        return Object.getOwnPropertyNames(obj).length === 0;
    }

    return exports;
});



/*
{
    "state":
    {
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
    },
    "type":"Extended color light",
    "name":"Living Room W",
    "modelid":"LCT001",
    "uniqueid":"00:17:88:01:00:bc:2d:ca-0b",
    "swversion":"66013452",
    "pointsymbol":
    {
        "1":"none",
        "2":"none",
        "3":"none",
        "4":"none",
        "5":"none",
        "6":"none",
        "7":"none",
        "8":"none"
    }
}
*/

