define(['jquery'], function($) {

    var exports = {};

    exports.post = function(a) {
        $.ajax({
            url: 'http://' + a.host + a.path,
            data: JSON.stringify(a.data),
            type: 'POST'
        }).done(function(data) {
            if (a.success) a.success(data);
        }).fail(function(e) {
            if (a.fail) a.fail(e);
        });
    };

    exports.put = function(a) {
        $.ajax({
            url: 'http://' + a.host + a.path,
            data: JSON.stringify(a.data),
            type: 'PUT'
        }).done(function(data) {
            if (a.success) a.success(data);
        }).fail(function(e) {
            if (a.fail) a.fail(e);
        });
    };

    exports.get = function(a) {
        var o = {
            url: 'http://' + a.host + a.path,
            type: 'GET'
        };

        if (a.data) {
            o.data = JSON.stringify(a.data);
        }

        $.ajax(o).done(function(data) {
            if (a.success) a.success(data);
        }).fail(function(e) {
            if (a.fail) a.fail(e);
        });

    };

    return exports;
});
