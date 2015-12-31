define(['http'], function(http) {

    var exports = {};

    exports.put = function(a) {

        return Promise(function(resolve, reject) {

            var options = {
                host: a.host,
                path: a.path,
                method: 'PUT'
            };

            var req = http.request(options, function (response) {
                var data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });

            // write data to be put
            req.write(JSON.stringify(a.data));

            req.on('error', reject);

            req.end();
        });
    };

    exports.post = function(a) {

        return Promise(function(resolve, reject) {

            var options = {
                host: a.host,
                path: a.path,
                method: 'POST'
            };

            // start the request
            var request = http.request(options, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });

            // write post data
            request.write(JSON.stringify(a.data));

            request.on('error', reject);

            request.end();
        });
    };

    exports.get = function(a) {

        return Promise(function(resolve, reject) {

            var options = {
                host: a.host,
                path: a.path
            };

            var request = http.request(options, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });

            request.on('error', reject);

            request.end();
        });
    };

    return exports;
});
