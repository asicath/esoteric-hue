define(function() {
    var exports = {};

    exports.create = function(name, x, y) {
        var color = {};

        color.name = name;
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
