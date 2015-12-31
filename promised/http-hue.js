define(['http-active'], function(http) {
    var exports = {};

    exports.get = function(o) {
        return http.get({
            host: o.host,
            path: o.path,
            data: o.data
        }).then(function(data) {

            // catch hue errors, they should be calling back on the success
            if (data.length && data[0].error) {
                return Promise.reject(new Error(data[0].error));
            }

            return data;
        });
    };

    exports.put = function(o) {
        return http.put({
            host: o.host,
            path: o.path,
            data: o.data
        }).then(function(data) {

            // catch hue errors, they should be calling back on the success
            if (data.length && data[0].error) {
                return Promise.reject(new Error(data[0].error));
            }

            return data;
        });
    };

    exports.post = function(o) {
        // host, path, data, success, fail
        return http.post({
            host: o.host,
            path: o.path,
            data: o.data
        }).then(function(data) {

            // catch hue errors, they should be calling back on the success
            if (data.length && data[0].error) {
                return Promise.reject(new Error(data[0].error));
            }

            return data;
        });
    };

    exports.abort = function(o) {
        return http.abort(o);
    };

    return exports;
});