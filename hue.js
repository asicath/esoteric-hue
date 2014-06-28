var http = require('http');

var httpGet = function(host, path, done, fail) {
    var options = {
        host: host,
        path: path
    };

    var callback = function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
            var data = null;
            try {
                data = JSON.parse(str);
                done(data);
            }
            catch (e) {
                console.log(e);
                fail(e);
            }


        });
    };
    http.request(options, callback).on('error', function (e) {
        console.log(e);
        fail(e);
    }).end();
};

var httpPut = function(host, path, data, done, fail) {
    var options = {
        host: host,
        path: path,
        method: 'PUT'
    };

    var callback = function(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () {
            var data = null;
            try {
                data = JSON.parse(str);
                done(data);
            }
            catch (e) {
                console.log(e);
                fail(e);
            }
        });
    };

    var req = http.request(options, callback);
    req.write(JSON.stringify(data));
    req.on('error', function (e) {
        console.log(e);
        fail(e);
    });
    req.end();
};




exports.init = function(onReady) {

    findIp(
        function() {
            console.log('found hub at ' + ip);

            if (needToCreateUser) {
                tryToCreateUser(function() {
                    checkIp(ip);
                    onReady();
                }, function() {
                    alert('could not create user');
                });
            } else {
                onReady();
            }

        },
        function() {
            alert('not found');
        }
    );
};

var findErrorCount = 0;
var needToCreateUser = false;
var needToPressLinkButton = false;
var deviceData = null;
var ip = null;
var username = 'asicath1234';
var url = '/api/' + username;

var findIp = function(success, error) {
    var number = 2;
    while (number < 3) {
        var targetIp = '10.0.0.' + number;
        checkIp(targetIp);
        number++;
    }
    setTimeout(function(){waitForIp(success, error);}, 100);
};

var waitForIp = function(success, error) {
    if (findErrorCount >= 255) {
        if (error) { error(); }
    }
    else if (ip) {
        success();
    }
    else {
        // Keep waiting
        setTimeout(function(){waitForIp(success, error);}, 100);
    }
};

var checkIp = function(targetIp) {

    httpGet(targetIp, '/api/' + username, function(data) {
        ip = targetIp;
        if (data.length && data[0].error && data[0].error.type == 1) {
            needToCreateUser = true;
        }
        else {
            deviceData = data;
        }
    }, function() {
        findErrorCount++;
    });

};

var tryToCreateUser = function(success, error) {
    console.log('NOT IMPLIMENTED YET');
};

exports.setLightStateAll = function(state, complete) {
    var a = [state, state, state, state];
    exports.setLightStateByArray(a, complete);
};

exports.setLightStateByArray = function(states, complete) {
    var finished = 0;

    var waitForFinish = function() {
        if (++finished == 4) {
            if (complete) complete();
        }
    };

    exports.setLightState(1, states[0], waitForFinish);
    exports.setLightState(3, states[1], waitForFinish);
    exports.setLightState(4, states[2], waitForFinish);
    exports.setLightState(2, states[3], waitForFinish);

};

exports.setLightState = function(id, state, complete, retryCount) {

    httpPut(ip, '/api/' + username + '/lights/' + id + '/state', state, function(data) {

        if (state.transitiontime) {
            // We must wait as long as the transition time before calling back to prevent overlap of commands
            setTimeout(function() {
                if (complete) {complete();}
            }, state.transitiontime * 100);
        }
        else {
            if (complete) {complete();}
        }

    }, function(e) {
        if (!retryCount) retryCount = 0;
        if (retryCount > 5) {return;}
        // retry
        exports.setLightState(id, state, complete, retryCount++);
        console.log('RETRY');
    });

};