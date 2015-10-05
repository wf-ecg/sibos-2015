/*jslint white:false */
/*global _, ShareStrings:true */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 kicker and binder

 TODO
 document a bit
 modernize

 */
define(['jquery', 'banner', 'extract', 'mobile', 'popup', 'jsmobi', 'jsview'], function
    ($, Banner, Extract, Mobile, Popup, jsMobi, jsView) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Main',
        self = {},
        Df, cfArr;

    Df = {// DEFAULTS
        inits: function () {
            self.isInited = true;

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

    function _addMetas() {
        var i, metas = [
            '<meta id="head1" name="title"              content="">',
            '<meta id="head2" name="description"        content="">',
            '<meta id="head3" property="og:title"       content="">',
            '<meta id="head4" property="og:description" content="">',
            '<meta id="head5" property="og:url"         content="">',
            '<meta id="head6" property="og:image"       content="http://www.wellsfargomedia.com/lib/images/wflogo.svg">',
            '<meta id="head7" property="og:site_name"   content="www.wellsfargomedia.com">',
            '<meta id="head8" property="og:type"        content="microsite">'
        ];

        for (i = 1; i < metas.length; i++) {
            $(metas[i]).insertAfter('#head0');
        }
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

    function fixExternal() {
        $('a.external').append('<img class="external">');

        $('.external').attr({
            title: 'Opens external site',
        });
        $('a.external, .external a').attr({
            target: 'external',
        });
        $('img.external, .external img').attr({
            alt: 'external site',
        });
        $('img.external').attr({
            src: './images/misc/link_icon.gif',
        });
    }

    function _binder() {
        _device();
        _activeNav();
        _addMetas();
        $('p.rotator').each(startRotator);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// INTERNAL

    function _init() {
        if (self.isInited) {
            return null;
        }
        Df.inits();

        dfInit();
        fixExternal();
        Extract.init();

        if (_whatPage() === 'mini.html') {
            Extract.nav($.Deferred()).done(function () {
                Banner.init();
                Mobile.init(self, Extract);
                _binder();
            });
        } else {
            Extract.head($.Deferred()).done(function () {
                Banner.init();
                _binder();
            });
        }

        Popup.init(self);
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
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
