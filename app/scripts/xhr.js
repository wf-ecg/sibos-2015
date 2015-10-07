/*jslint white:false, evil:true */
/*global define */

define(['jquery'], function XHR($) {
    var Cache = $('<div>');

    function usurp(sel) {
        var fill, self;

        self = $(sel);
        fill = Cache.find(sel);

        self.append(fill.children());
    }

    function doit(done) {
        Cache.load('_parts.html', function () {
            usurp('#navbar');
            usurp('#stickyBar');
            usurp('#menu-4');
            usurp('.externals');
            usurp('.copyrights');
            usurp('.modal');
            done();
        });
    }

    return {
        doit: doit,
    };
});
