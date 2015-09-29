/*jslint white:false */
/*global _, C, W, Glob, Util, jQuery */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Banner = (function ($, G) { // IIFE
    'use strict';
    var name = 'Banner',
        self = new G.constructor(name, '(fade and loop)'),
        Df;

    Df = { // DEFAULTS
        inits: function (cb) {
            this.all = $('.fade');
            this.total = this.all.length;
            this.now = Df.total - 1;
            this.time = 1666;
            this.all.css({
                position: 'absolute',
            });
        },
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // EXTEND

    $.fn.getFactor = function () {
        var num = 1 * $(this).data('fade');
        return num;
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // INTERNALS

    function descend() {
        Df.now--;

        if (Df.now <= 0) {
            Df.now = Df.total - 1;
            Df.all.fadeIn(0);
        }
    }

    function _runfade() {
        var next = Df.all.eq(Df.now);
        var time = (Df.time / next.getFactor());

        //C.log('do next in', time, Df.now);

        next.fadeOut(Df.time, function () {

            W.setTimeout(function () {
                descend();
                _runfade(); // recurses
            }, time);
        });
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.isInited(true)) {
            return null;
        }
        Df.inits();
        _runfade();

        $('.banner').fadeOut(1).fadeIn(999);
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        init: _init,
    });

    return self;
}(jQuery, Glob));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
