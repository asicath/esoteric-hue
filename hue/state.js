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

        // exports a data object with the state info
        // should be ready to pass to webservice
        state.getDataObject = function() {

            // start with color
            var o = (color !== null) ? color.getState() : {};

            // next if state is on or not
            if (on !== null) o.on = on;

            // then address the brightness
            if (brightness !== null) o.bri = brightness;

            return o;
        };

        return state;
    };

    return exports;
});
