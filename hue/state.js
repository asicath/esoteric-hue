define(function() {

    var exports = {};

    exports.create = function(on, brightness, color) {
        var state = {
            on: on,
            brightness: brightness,
            color: color
            //"effect":"none", // none or colorloop
            //"alert":"none",
        };

        /* for alert:
        "none" – The light is not performing an alert effect.
        "select" – The light is performing one breathe cycle.
        "lselect" – The light is performing breathe cycles for 15 seconds or until an "alert": "none" command is received.
        */

        return state;
    };

    return exports;
});
