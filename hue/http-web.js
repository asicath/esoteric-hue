define(['jquery'], function($) {

    var exports = {};

    exports.put = function(host, path, data, success, fail) {

        $.ajax({
            url: 'http://' + host + path,
            data: JSON.stringify(data),
            type: 'PUT'
        }).done(function(data) {
            success(data);
        }).fail(function(e) {
            fail(e);
        });

    };

    exports.post = function(host, path, data, success, fail) {
        $.ajax({
            url: 'http://' + host + path,
            data: JSON.stringify(data),
            type: 'POST',
            timeout: 3000
        }).done(function(data) {
            success(data);
        }).fail(function(e) {
            if (fail) fail(e);
        });
    };

    return exports;
});
