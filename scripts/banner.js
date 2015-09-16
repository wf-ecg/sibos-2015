/*jslint white:false */
/*globals _, C, W, Glob, Util, jQuery,
        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Banner = (function ($, G, U) { // IIFE
    'use strict';
    var name = 'Banner',
        self = new G.constructor(name, '(fade and loop)'),
        Df;

    Df = { // DEFAULTS
        inits: function (cb) {
            this.all = $('.fade');
            this.total = this.all.length;
            this.now = 2;
            this.time = 666;
            this.all.css({
                position: 'absolute',
            });
        },
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // HELPERS (defaults dependancy only)

    function binder(obj) {
        $.each(obj, function (i, e) {
            var anc;

            if (e !== '#') {
                anc = $('<a>').attr('href', e);
                $('.' + i).wrap(anc);
            }
        });
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // INTERNALS

    function descend() {
        Df.now--;

        if (Df.now <= 0) {
            Df.now = Df.total - 1;
            Df.all.fadeIn(0);
        }
        if (U.debug(2)) {
            C.debug(Df.now);
        }
    }

    function _runfade() {
        descend();

        Df.all.eq(Df.now) //
        .fadeOut(Df.time, function () {
            W.setTimeout(function () {
                _runfade(); // recurses
            }, Df.time * 3);
        });
    }

    function _binding() {
        $('.banner').fadeOut(1).fadeIn(999);
    }
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init(obj) {
        if (self.isInited(true)) {
            return null;
        }
        Df.inits();
        _runfade();

        if (obj) {
            binder(obj);
        }
        _binding();
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        init: _init,
    });

    return self;
}(jQuery, Glob, Util));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
