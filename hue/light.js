define(function() {

    var exports = {};

    exports.create = function(hub, id, info) {
        var light = {};

        light.id = id;
        light.name = info.name;
        light.state = info.state;

        light.setState = function(state, transitionTime) {

            // get the full data object
            var data = state.getDataObject();

            // crop data down to just changes for better performance

            // add in the transitionTime
            transitionTime = transitionTime || 0; // default to 0
            data.transitiontime = transitionTime / 100; // called out in 100ms periods

            // now make the call
            hub.setLightState(id, data,
                function() {

                },
                function() {

                }
            );
        };

        return light;
    };

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

