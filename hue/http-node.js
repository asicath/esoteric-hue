define(['http'], function(http) {

    var exports = {};

    exports.put = function(host, path, data, done, fail) {
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

});
