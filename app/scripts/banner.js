/*jslint white:false */
/*global _ */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 fade and loop

 TODO
 document a bit
 modernize

 */
define(['jquery'], function ($) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Banner',
        self = {},
        Df;

    Df = {// DEFAULTS
        inits: function () {
            self.isInited = true;

            this.all = $('.fade');
            this.total = this.all.length;
            this.now = Df.total - 1;
            this.time = 666;
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
        var time = (Df.time * next.getFactor());

        //C.log('do next in', time, Df.now);

        next.fadeOut(time, function () {

            W.setTimeout(function () {
                descend();
                _runfade(); // recurses
            }, time);
        });
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.isInited) {
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
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
