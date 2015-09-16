/*jslint white:false */
/*globals _, C, W, Glob, Util, jQuery,
        Extract, Main, Mobile:true, jsMobi, jsView, */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Mobile = (function ($, G, U) { // IIFE
    'use strict';
    var name = 'Mobile',
        self = new G.constructor(name, '(mobile nav and page swapper)'),
        Df;

    Df = { // DEFAULTS
        atnav: true,
        bezel: '<div class="bezel"></div>',
        busy: false,
        current: '',
        high: 999,
        left: 111,
        mobile: '#Mobile',
        nav: null,
        page: '#Desktop',
        share: '#Share',
        time: 333,
        wide: 999,
        inits: function () {
            Df.bezel = $(Df.bezel);
            Df.page = $(Df.page);
            Df.mobile = $(Df.mobile).show();
            Df.nav = Df.mobile.find('article').first().addClass('nav');

            if (Main.mobile) {
                self.sizer();
                $('html').addClass(jsMobi.any()[0]);
                // $('#scrollbox').on('touchstart', function(event){});
                /// body --- no gradients?

                $(W).bind('resize orientationchange', _.debounce(function () {
                    if (jsView.port.orientation() === 'landscape') {
                        W.alert('The view in landscape is sub-optimal.');
                    }
                    self.sizer();
                    W.location.reload();
                }, 333));
            }
            if (U.debug()) {
                C.debug(name, 'Df.inits\n', Df);
            }
        }
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // HELPERS (defaults dependancy only)

    function isInternal(str) {
        var ts1, ts2, ts3;
        ts1 = str.match(W.location.host);
        ts2 = str.match('.html');
        ts3 = !str.match(/#./); // allow anchors to work
        return (ts1 && ts2 && ts3);
    }

    function share(evt) {
        evt.stopPropagation();

        Df.share.fadeIn(function () {
            Df.share.css({
                display: 'table',
            });
            Df.mobile.one('click', function () {
                Df.share.hide();
            });
        });
    }

    function slide(jq, num1, num2, cb) {
        jq.css({
            display: 'block',
            left: num1 + Df.left,
            width: Df.wide,
            height: Df.high,
            position: 'absolute',
        }).animate({
            left: num2 + Df.left,
        }, Df.time, cb);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // INTERNALS

    function _sizer() {
        Df.mobile.css({
            height: jsView.port.visualHeight(), // .layoutHeight(),
            width: jsView.port.visualWidth(), // .layoutWidth(),
        });
        // get width (and offset)
        Df.wide = Df.nav.parent().innerWidth() || 300;
        Df.high = Df.nav.parent().parent().outerHeight() - 99;
        Df.left = (parseInt(Df.nav.parent().css('left'), 10) || 0);
        Df.nav.parent().css({
            width: Df.wide,
            height: Df.high,
        });
        _.delay(function () {
            var x, y;
            x = $('.banner');
            y = x.find('img').first();
            if (Df.high < 280) {
                x.hide(); // ip4/ios6 only 257! (so hide banner)
            }
            y = y.height() * 1.1;
            x.height(y);
        }, 333);
    }

    function _revealPage(jq, yes) {
        if (!Df.atnav) {
            Df.current.hide();
        } else if (!yes) {
            return;
        }
        Df.current = jq;

        if (U.debug()) {
            C.debug(name, '_revealPage >', (yes ? jq.toString() : 'home'));
        }

        if (yes) {
            jq.show();
            slide(Df.nav, 0, Df.wide * -1);
            slide(jq, Df.wide, 0);
            Df.atnav = false;
        } else {
            slide(Df.nav, Df.wide * -1, 0);
            slide(jq, 0, Df.wide, function () {
                jq.hide();
            });
            Df.atnav = true;
        }
    }

    function _embezelr() {
        if (!Main.mobile) {
            Df.mobile.wrap(Df.bezel);
            Df.page.show();
        } else {
            Df.page.remove();
            Df.mobile.css({
                zIndex: 1
            });
        }
    }

    function _slider(evt) {
        var str = evt.currentTarget.href; // current because A wraps IMG

        if (isInternal(str)) {
            evt.preventDefault();
        } else {
            return;
        }

        str = Main.page(str);
        if (U.debug()) {
            C.debug(name, '_slider', str);
        }
        Extract.page(str, $.Deferred().done(self.drill));
    }

    function _binding() {
        // SHARE
        Df.share = $(Df.share).hide();
        Df.mobile.find('header').append(Df.share);
        $('img.share').click(share);
        // HOME
        $('body').on('click', '#Mobile section.port a', _slider);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.isInited(true)) {
            return null;
        }
        Df.inits();
        _embezelr();
        _binding();
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        init: _init,
        drill: function (jq) {
            _revealPage(jq, true);
        },
        home: function (evt) {
            evt.preventDefault();
            _revealPage(Df.current, false);
        },
        slider: _slider,
        sizer: _sizer,
    });

    return self;
}(jQuery, Glob, Util));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*

find nav
    suppress default
    detect target page
    check db
        is older than
            ajax fetch
        else
            use it
    slide out nav
    slide in body
        article group?
        take composition cues from ajax page
        a div in there suggest what to knit

 */
