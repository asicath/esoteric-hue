define(['jquery'], function($) {

    var exports = {};

    exports.post = function(host, path, data, success, fail) {
        $.ajax({
            url: 'http://' + host + path,
            data: JSON.stringify(data),
            type: 'POST'
        }).done(function(data) {
            success(data);
        }).fail(function(e) {
            if (fail) fail(e);
        });
    };

    exports.put = function(host, path, data, success, fail) {
        $.ajax({
            url: 'http://' + host + path,
            data: JSON.stringify(data),
            type: 'PUT'
        }).done(function(data) {
            success(data);
        }).fail(function(e) {
            if (fail) fail(e);
        });
    };

    exports.get = function(host, path, data, success, fail) {
        var o = {
            url: 'http://' + host + path,
            type: 'GET'
        };

        if (data) {
            o.data = JSON.stringify(data);
        }

        $.ajax(o).done(function(data) {
            success(data);
        }).fail(function(e) {
            fail(e);
        });

    };

    return exports;
});
