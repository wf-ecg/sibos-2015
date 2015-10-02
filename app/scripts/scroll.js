/*jslint white:false */
/*globals _, C, W, Glob, Util, jQuery,
        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Scroll = (function ($, G, U) { // IIFE
    'use strict';
    var name = 'Scroll',
        self = new G.constructor(name, '(scroll and do it smooth)'),
        Df;

    Df = { // DEFAULTS
        box: $(W.isIE ? 'html' : 'body'),
        inits: function (cb) {},
        fixed: null,
        funum: 320,
        mysel: '.tofix',
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _scroll(ele, amt) {
        amt = amt || 0;
        ele = ele || Df.box;

        var $me = $(ele);

        if (U.debug()) {
            C.debug(name + '_scroll', '\n', amt + 'px', [$me]);
        }

        // look before leap
        if ($me.length) {
            $me.addClass('target');
            Df.box.stop().animate({
                scrollTop: $me.offset().top + amt,
            }, 333, function () {
                W.location.hash = $me.get(0).id;
                if (!amt) {
                    _scroll(ele, -15);
                }
                $me.removeClass('target');
            });
        }
    }

    function _fixit() {
        if (Df.fixed) {
            return Df.fixed;
        }
        Df.fixed = $(Df.mysel);
        Df.fixed.css({
            position: 'static',
            width: Df.fixed.width(),
            top: Df.funum / 2,
        });
    }

    function _bind() {
        $(W).on('scroll', function (evt) {
            var me, off;

            me = _fixit();
            off = this.pageYOffset;

            if (!me) {
                return;
            }
            if (off > Df.funum * 2) {
                me.css({
                    position: 'fixed',
                });
            } else {
                me.css({
                    position: 'static',
                });
            }
        });

        $('.scroll').click(function (evt) {
            var str = evt.target.href;

            // smooth and prevent def
            evt.preventDefault();
            str = str.split('#')[1];

            _scroll('#' + str);
        });
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.isInited(true)) {
            return null;
        }

        _bind();
        //_scroll(); // wake up
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        init: _init,
        update: _scroll,
    });

    return self;
}(jQuery, Glob, Util));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
