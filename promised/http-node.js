define(['http'], function(http) {

    var exports = {};

    exports.put = function(a) {
        var options = {
            host: a.host,
            path: a.path,
            method: 'PUT'
        };

        var req = http.request(options, function(response) {
            var str = '';
            response.on('data', function (chunk) { str += chunk; });
            response.on('end', function () {
                try {
                    a.success(JSON.parse(str));
                }
                catch (e) {
                    a.fail(e);
                }
            });
        });

        // write data to be put
        req.write(JSON.stringify(a.data));

        req.on('error', function (e) {
            a.fail(e);
        });

        req.end();
    };


    exports.post = function(a) {

        var options = {
            host: a.host,
            path: a.path,
            method: 'POST'
        };

        // start the request
        var request = http.request(options, function (res) {
            var data = '';
            res.on('data', function (chunk) {data += chunk;});
            res.on('end', function () {
                try {
                    a.success(JSON.parse(data));
                }
                catch (e) {
                    a.fail(e);
                }
            });
        });

        // write post data
        request.write(JSON.stringify(a.data));

        request.on('error', function (e) {
            a.fail(e);
        });

        request.end();
    };



    exports.get = function(a) {
        var options = {
            host: a.host,
            path: a.path
        };

        var request = http.request(options, function (res) {
            var data = '';
            res.on('data', function (chunk) { data += chunk; });
            res.on('end', function () {
                try {
                    a.success(JSON.parse(data));
                }
                catch (e) {
                    a.fail(e);
                }
            });
        });

        request.on('error', function (e) {
            a.fail(e);
        });

        request.end();
    };


    return exports;
});
