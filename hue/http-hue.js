define(['http-active'], function(http) {
    var exports = {};

    exports.get = function(host, path, data, success, fail) {
        http.get(
            host,
            path,
            data,
            function(data) {
                // catch hue errors, they should be calling back on the success
                if (data.length && data[0].error) {
                    fail(data);
                }
                else {
                    success();
                }
            },
            // on a simple fail, just pass through
            function(e) {
                fail(e);
            }
        );
    };

    exports.post = function(host, path, data, success, fail) {
        http.post(
            host,
            path,
            data,
            function(data) {
                // catch hue errors, they should be calling back on the success
                if (data.length && data[0].error) {
                    fail(data);
                }
                else {
                    success();
                }
            },
            // on a simple fail, just pass through
            function(e) {
                fail(e);
            }
        );
    };

    return exports;
});