/*jslint white:false */
/*global _, C, W, Glob, jQuery, Banner, Extract, Main:true, Mobile, Popup, Scroll, ShareStrings:true, jsMobi, jsView */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Main = (function ($, G) { // IIFE
    'use strict';
    var name = 'Main',
        self = new G.constructor(name, '(kicker and binder)'),
        Df, cfArr;

    Df = {// DEFAULTS
        inits: function () {
            if (jsView.device.width < 800) {
                jsMobi.insist('ask');
            } else {
                jsMobi.insist();
            }
            C.info('Main init @ ' + Date(), {
                debug: W.debug,
            });
        },
    };
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function dfInit() {
        var raw, pageHash;

        raw = W.location.pathname.split('/').pop().match(/\w+/g);
        pageHash = {
            about: ["About Wells Fargo", 'Learn about the #WellsFargo Global Financial Institutions business'],
            booth: ["Visit Our Booth", 'See pics of the #WellsFargo booth & learn about events being hosted'],
            events: ["Sibos Events", 'Learn more about the #WellsFargo events at #Sibos'],
            explore: ["Explore Singapore", 'See what Singapore has to offer at #Sibos 2015'],
            giving: ["Charitable Giving", 'Learn more about the #WellsFargo charity programs at #Sibos'],
            home: ["Home", 'Check out the #WellsFargo Global Financial Institutions Sibos microsite'],
            mini: ["Sibos", 'Check out the #WellsFargo Global Financial Institutions Sibos microsite'],
            speakers: ["Sibos Speakers", 'Learn about the #WellsFargo Global Financial Institutions publications'],
            test: ["x", 'x'],
        };
        try {
            cfArr = pageHash[raw[0]] || pageHash.mini;
            ShareStrings = {
                url: 'http://wellsfargomedia.com/sibos/', /// show home only
                img: 'http://wellsfargomedia.com/sibos/images/header/wf.png',
                tab: 'Wells Fargo at Sibos 2015 – ' + cfArr[0],
                sum: cfArr[1],
            };
            $('#head1, #head3').attr('content', ShareStrings.tab);
            $('#head2, #head4').attr('content', ShareStrings.sum);
            $('#head5').attr('content', ShareStrings.url);
            $('#head0').text(ShareStrings.tab);
        } catch (e) {
            C.error(e);
        }
    }
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// HANDLERS

    function _whatPage(x) {
        x = x || W.location.pathname;
        return x.split('/').slice(-1).toString();
    }

    function _noExt(x) {
        x = x.split('.');
        return x.slice(0, 1).toString();
    }

    function _device() {
        if (!jsMobi.any()) {
            $('html').addClass('desktop');
        } else {
            $('html').addClass('mobile');
        }
    }

    function _activeNav() {
        var page = (' ' + W.location.pathname).split('/').pop();
        $('a[href="./' + page + '"]').first().addClass('active');
    }

    function startRotator(i, e) {
        var div = $(e);
        var all = div.find('a');
        var next = -1;
        var ln = all.length;
        var time = 5555;
        var fade = time / 5;
        var loop;

        // hide lock parent size
        all.hide().first().show();
        div.height(div.height());
        all.css('position', 'absolute');

        loop = function () {
            all.eq(next).fadeOut(fade).end() //
                .eq(next = (next + 1) % ln).fadeIn(fade);
            // repeat every 5 seconds
            W.setTimeout(loop, time);
        };
        loop();
    }

    function _binder() {
        _device();
        _activeNav();
        $('p.rotator').each(startRotator);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// INTERNAL

    function _init() {
        if (self.isInited(true)) {
            return null;
        }
        Df.inits();

        dfInit();
        //Scroll.init();
        Extract.init();

        if (_whatPage() === 'mini.html') {
            Extract.nav($.Deferred()).done(function () {
                Banner.init();
                Mobile.init();
                _binder();
            });
        } else {
            Extract.head($.Deferred()).done(function () {
                Banner.init();
                _binder();
            });
        }

        Popup.init();
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        __: Df,
        init: _init,
        mobile: !!jsMobi.any(),
        noext: _noExt,
        page: _whatPage,
        cb: function () {
            C.debug.apply(C, [name, 'callback'].concat(arguments));
        },
    });

    return self;
}(jQuery, Glob));

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
