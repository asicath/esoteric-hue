define(['http-active'], function(http) {
    var exports = {};

    exports.get = function(o) {
        http.get({
            host: o.host,
            path: o.path,
            data: o.data,
            success: function (data) {
                // catch hue errors, they should be calling back on the success
                if (data.length && data[0].error) {
                    if (o.fail) o.fail(data);
                }
                else {
                    if (o.success) o.success(data);
                }
            },
            // on a simple fail, just pass through
            fail: function (e) {
                if (o.fail) o.fail(e);
            }
        });
    };

    exports.put = function(o) {
        http.put({
            host: o.host,
            path: o.path,
            data: o.data,
            success: function (data) {
                // catch hue errors, they should be calling back on the success
                if (data.length && data[0].error) {
                    if (o.fail) o.fail(data);
                }
                else {
                    if (o.success) o.success(data);
                }
            },
            // on a simple fail, just pass through
            fail: function (e) {
                if (o.fail) o.fail(e);
            }
        });
    };

    exports.post = function(o) {
        // host, path, data, success, fail
        http.post({
            host: o.host,
            path: o.path,
            data: o.data,
            success: function (data) {
                // catch hue errors, they should be calling back on the success
                if (data.length && data[0].error) {
                    if (o.fail) o.fail(data);
                }
                else {
                    if (o.success) o.success(data);
                }
            },
            // on a simple fail, just pass through
            fail: function (e) {
                if (o.fail) o.fail(e);
            }
        });
    };

    return exports;
});