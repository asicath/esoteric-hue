
function main() {

    findIp(
        function() {
            if (needToCreateUser) {
                tryToCreateUser(function() {checkIp(ip)}, function() {alert('could not create user');});
            }
        },
        function() {
            alert('not found');
        }
    );
}

var findErrorCount = 0;
var ip = null;
var needToCreateUser = false;
var needToPressLinkButton = false;
var username = 'asicath1234';
var deviceData = null;

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
    $.ajax({
        url: 'http://' + targetIp + '/api/' + username,
        type: 'GET'
    }).done(function(data) {
        ip = targetIp;
        if (data.length && data[0].error && data[0].error.type == 1) {
            needToCreateUser = true;
        }
        else {
            deviceData = data;
            //$('body').html('connected');
            MainProgram();
        }
    }).fail(function() {
        findErrorCount++;
    });
};

var tryToCreateUser = function(success, error) {

    $.ajax({
        url: 'http://' + ip + '/api',
        data: JSON.stringify({devicetype:'scottsApp1', username:username}),
        type: 'POST'
    }).done(function(data) {
        if (data[0].error && data[0].error.type == 101) {
            needToPressLinkButton = true;
            $('body').html('press link button');
            setTimeout(function() {tryToCreateUser(success, error);}, 100);
        }
        else if (data[0].error) {
            alert(data[0].error.type + " : " + data[0].error.description);
            error();
        }
        else {
            $('body').html('');
            success();
        }
    }).fail(function() {
        alert('shouldnt get this 1');
    });

};

var setLightStateAll = function(state, complete) {
    var finished = 0;

    var waitForFinish = function() {
        if (++finished == 4) {
            if (complete) complete();
        }
    };

    setLightState(1, state, waitForFinish);
    setLightState(2, state, waitForFinish);
    setLightState(3, state, waitForFinish);
    setLightState(4, state, waitForFinish);

};

var setLightState = function(id, state, complete, retryCount) {

    $.ajax({
        url: 'http://' + ip + '/api/' + username + '/lights/' + id + '/state',
        data: JSON.stringify(state),
        type: 'PUT'
    }).done(function(data) {

            if (state.transitiontime) {
                // We must wait as long as the transition time before calling back to prevent overlap of commands
                setTimeout(function() {
                    if (complete) {complete();}
                }, state.transitiontime * 100);
            }
            else {
                if (complete) {complete();}
            }
        }).fail(function() {
            if (!retryCount) retryCount = 0;
            if (retryCount > 5) {return;}
            // retry
            setLightState(id, state, complete, retryCount++);
        });
};



var MainProgram = function() {
    FindColor();
};


var FindColor = function() {


    //setLightStateAll(state);

    $('.plus').on('click', function() {
        var amount = $(this).data('amount');
        changeAll(amount, 0, 0);
    });

    $('.minus').on('click', function() {
        var amount = $(this).data('amount');
        changeAll(-amount, 0, 0);
    });

    $('#hue').on('keyup', function(e1, e2, e3) {
        if (e1.keyCode == 38) {
            changeAll(1000, 0, 0);
        }
        if (e1.keyCode == 40) {
            changeAll(-1000, 0, 0);
        }
        if (e1.keyCode == 13) {
            changeAll(0, 0, 0);
        }
    });


    $('#brightness').on('keyup', function(e1, e2, e3) {
        if (e1.keyCode == 13) {
            changeAll(0, 0, 0);
        }
        if (e1.keyCode == 38) {
            changeAll(0, 10, 0);
        }
        if (e1.keyCode == 40) {
            changeAll(0, -10, 0);
        }
    });

    $('#saturation').on('keyup', function(e1, e2, e3) {
        if (e1.keyCode == 13) {
            changeAll(0, 0, 0);
        }
        if (e1.keyCode == 38) {
            changeAll(0, 0, 10);
        }
        if (e1.keyCode == 40) {
            changeAll(0, 0, -10);
        }
    });

    $('.alert').on('click', function() {
        // create the state
        var state = {
            alert: $(this).val()
        };

        // send the state
        setLightStateAll(state, function() { });
    });

};




var changeAll = function(dHue, dBri, dSat) {
    var hue = parseInt($('#hue').val());
    var bri = parseInt($('#brightness').val());
    var sat = parseInt($('#saturation').val());
    setAll(hue + dHue, bri + dBri, sat + dSat, 100);
};


var sending = false;

var setAll = function(hue, bri, sat, time) {

    // prevent multiple...
    if (sending) {return;}
    sending = true;

    // force max/min
    var maxHue = 65535;
    if (hue > maxHue) {hue -= maxHue;}
    if (hue < 0) {hue += maxHue;}
    var maxBri = 255;
    if (bri > maxBri) {bri = maxBri;}
    if (bri < 0) {bri = 0;}
    var maxSat = 255;
    if (sat > maxSat) {sat = maxSat;}
    if (sat < 0) {sat = 0;}

    // update the ui
    $('#hue').val(hue);
    $('#brightness').val(bri);
    $('#saturation').val(sat);

    // time
    if (!time) {
        time = 1;
    }
    else {
        time = time / 100;
    }

    // create the state
    var state = {
        transitiontime: time,
        hue: hue,
        bri: bri,
        sat: sat
    };

    // send the state
    $('#status').html('sending...');
    setLightStateAll(state, function() {
        $('#status').html('complete');
        sending = false;
    });

};

$(document).ready(function() {
    main();
});




