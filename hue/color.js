define(function() {
    var exports = {};

    exports.HUE_MIN = 0;
    exports.HUE_MAX = 65535;
    exports.SAT_MIN = 254;
    exports.SAT_MAX = 254;
    exports.CT_MIN = 153;
    exports.CT_MAX = 500;

    exports.createByXY = function(name, x, y) {
        var color = {};

        color.name = name;
        color.colormode = "xy";

        color.getState = function() {
            return {
                xy: [x,y]
            };
        };

        return color;
    };

    exports.createByCT = function(name, ct) {
        var color = {};

        color.name = name;
        color.colormode = "ct";

        color.getState = function() {
            return {
                ct: ct
            };
        };

        return color;
    };

    exports.createByHS = function(name, hue, saturation) {
        var color = {};

        color.name = name;
        color.colormode = "hs";

        color.getState = function() {
            return {
                hue: hue,
                sat: saturation
            };
        };

        return color;
    };


    // *** MANUAL COLOR TRIANGLE ***

    function lineLength(p0, p1) {
        return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
    }

    // as defined in the API
    var points = {
        r: {x: 0.674, y: 0.322},    // Lower right
        g: {x: 0.408, y: 0.517},    // Upper center
        b: {x: 0.168, y: 0.041}     // Lower left
    };

    // create a color for the three RGB extremities
    exports.RED = exports.createByXY('red', points.r.x, points.r.y);
    exports.GREEN = exports.createByXY('green', points.g.x, points.g.y);
    exports.BLUE = exports.createByXY('blue', points.b.x, points.b.y);

    // similar to Hue/Saturation, but more precise?
    exports.createByTriangle = function(name, percent, saturation) {

        percent = percent % 1.0;

        // calculate the length of each line
        var lines = {
            rg: {
                start: points.r,
                end: points.g,
                length: lineLength(points.r, points.g)
            },
            gb: {
                start: points.g,
                end: points.b,
                length: lineLength(points.g, points.b)
            },
            br: {
                start: points.b,
                end: points.r,
                length: lineLength(points.b, points.r)
            }
        };

        // imagine as a straight line
        var totalLength = lines.rg.length + lines.gb.length + lines.br.length;

        // find the place on that line by percent
        var targetLength = totalLength * percent;

        // assume the RG line first
        var line = lines.rg;

        // determine if we need to move on to the GB line
        if (targetLength > line.length) {
            targetLength -= line.length;
            line = lines.gb;
        }

        // determine if we need to move on to the BR line
        if (targetLength > line.length) {
            targetLength -= line.length;
            line = lines.br;
        }

        // find the XY coordinate
        var linePercent = targetLength / line.length;
        var p = {
            saturation: 1,
            p: percent,
            x: line.start.x + (line.end.x - line.start.x) * linePercent,
            y: line.start.y + (line.end.y - line.start.y) * linePercent
        };

        if (typeof saturation !== 'undefined') p = desaturate(p, saturation);

        // finally return an xy
        return exports.createByXY(name, p.x, p.y);
    };

    function desaturate(p, saturation) {

        // 6500k
        var center = {
            x: 0.31569,
            y: 0.32960
        };

        var totalLength = lineLength(center, p);
        var length = (1 - saturation) * totalLength;

        var p2 = {
            x: p.x + (length / totalLength) * (center.x - p.x),
            y: p.y + (length / totalLength) * (center.y - p.y),
            saturation: saturation,
            p: p.p
        };

        return p2;
    }



    return exports;
});
