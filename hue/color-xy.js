define(function() {
    var exports = {};

    exports.create = function(x, y) {
        var color = {};

        color.type = "xy";

        color.getState = function() {
            return {
                xy:[x,y]
            };
        };

        return color;
    };


    return exports;
});
