
var lineLength = function(p0, p1) {
    return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
};

var points = {
    r: {x: 0.674, y: 0.322},    // Lower right
    g: {x: 0.408, y: 0.517},    // Upper center
    b: {x: 0.168, y: 0.041}     // Lower left
};

exports.points = points;

exports.getXY = function(percent, saturation) {

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

    return p;
};

var desaturate = function(p, saturation) {

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
};
