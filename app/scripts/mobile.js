/*jslint white:false */
/*global _ */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 mobile nav and page swapper

 TODO
 document a bit
 modernize

 */
define(['jquery', 'jsmobi', 'jsview'], function
    ($, jsMobi, jsView) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Mobile',
        self = {},
        Df, El;
    var Main, Extract;

    Df = {// DEFAULTS
        atnav: true,
        busy: false,
        current: '',
        high: 999,
        left: 111,
        nav: null,
        time: 333,
        wide: 999,
        inits: function () {
            self.isInited = true;
            $.reify(El);

            El.mobile.show();
            El.share.hide();
            Df.nav = El.mobile.find('article').first().addClass('nav');

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
        }
    };
    El = {// ELEMENTS
        bezel: '<div class="bezel"></div>',
        page: '#Desktop',
        mobile: '#Mobile',
        share: '#Share',
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

        El.share.fadeIn(function () {
            El.share.css({
                display: 'table',
            });
            El.mobile.one('click', function () {
                El.share.hide();
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
        El.mobile.css({
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
        El.mobile.find('header .home').hide();

        if (!Df.atnav) {
            Df.current.hide();
        } else if (!yes) {
            return;
        }
        Df.current = jq;

        if (yes) {
            El.mobile.find('header .home').fadeIn();
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
            El.mobile.wrap(El.bezel);
            El.page.show();
        } else {
            El.page.remove();
            El.mobile.css({
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
        Extract.page(str, $.Deferred().done(self.drill));
    }

    function _binding() {
        // SHARE
        El.mobile.find('header').append(El.share);
        $('img.share').click(share);
        // HOME
        $('body').on('click', '#Mobile section.port a', _slider);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init(m, e) {
        if (self.isInited) {
            return null;
        }
        Main = m;
        Extract = e;

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
});

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
