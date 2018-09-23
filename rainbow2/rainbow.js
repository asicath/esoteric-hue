var baseUrl = "http://192.168.0.101/api";

var post = "POST";
var get = "GET";

function api(method, url, data, includeUsername) {

    if (includeUsername) {
        var username = localStorage.getItem('username');
        url = '/' + username + url;
    }

    if (data !== null) {
        data = JSON.stringify(data);
    }

    return new Promise(function (resolve, reject) {
        $.ajax({
            type: method,
            url: baseUrl + url,
            data: data,
            success: function(result) {

                if (result.hasOwnProperty(0)) {
                    var o = result[0];
                    if (o.hasOwnProperty('error')) reject(new Error(o.error.description));
                    else resolve(o.success);
                }
                else {
                    resolve(result);
                }

            },
            error: reject
        });
    });
}

function createUser() {
    return api(post, "", { devicetype: 'esoteric_hue#html' })
        .then(function (result) {
            localStorage.setItem('username', result.username);
            return username;
        });
}

function init() {
    var username = localStorage.getItem('username');
    if (username === null) {
        return createUser();
    }
    return Promise.resolve(username);
}


function getAllLights() {
    return api(get, "/lights", null, true)
        .then(function (result) {

            return result;
        });
}

function rainbow() {
    function next() {
        turnNextColor();
        setTimeout(next, 2000);
    }
    next();
}

var colorIndex = 0;
function turnNextColor() {

    var i = colorIndex;
    colorIndex = (colorIndex + 1) % rainbowStates.length;


    return Promise.all([
        setState("Living Room W", rainbowStates[i]),
        setState("Living Room E", rainbowStates[i])
    ]);
    /*
    var id = lights["Living Room W"];

    return api("PUT", "/lights/" + id + "/state", {hue:20000, sat:254, bri:254, transitiontime:10}, true)
        .then(function (result) {

            return JSON.stringify(result);
        });
        */
}

function setState(name, state) {
    var id = lights[name];
    var data = {sat: 254, transitiontime:20, bri: state.bri, xy:[state.color.x, state.color.y] };
    return api("PUT", "/lights/" + id + "/state", data, true);
}

var lights = {};

var rainbowStates = [
    {bri:245, color: Color.createByTriangle(0.00, 1.0)},
    {bri:255, color: Color.createByTriangle(0.05, 1.0)},
    {bri:255, color: Color.createByTriangle(0.12, 1.0)},
    {bri:150, color: Color.createByTriangle(0.2287, 1.0)},
    {bri:255, color: Color.createByTriangle(0.56, 1.0)},
    {bri:150, color: Color.createByTriangle(0.60, 1.0)},
    {bri:255, color: Color.createByTriangle(0.65, 1.0)}
];

$(function() {

    init()
        .then(getAllLights)
        .then(function(list) {

            for (var key in list) {
                var o = list[key];
                lights[o.name] = key;
            }
        })
        .then(rainbow)
        .then(function(msg) {
            //$('#msg').html('');
        })
        .catch(function(err) {
            $('#error').html(err.message);
        });


});

// [{"success":{"username":"ntHeOvsBNxESqut0a6I-odOC8MUeClhkivgke9sX"}}]