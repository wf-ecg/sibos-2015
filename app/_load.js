/*jslint white:false */
/*globals _, C, W, Glob, jQuery,
        Main, Modernizr, Popup, Typekit, ROOT */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Data, Load, Tests, ShareStrings, switchTo5x = true;

(function ($, M, G) {
    'use strict';
    G.Load = {};
    W.Tests = $.Callbacks();

    _.defaults(G, { /// all stubs terminated
        dir: ROOT.dir + '/',
        lib: ROOT.lib + '/',
        ven: ROOT.dir + '/vendor/',
    });

    if ($.browser.msie) {
        $(function () {
            $('html').addClass('msie');
            $('body').on('mouseover', '.region, .widget, a, li', function () {
                $(this).addClass('hover');
            }).on('mouseout', '.region, .widget, a, li', function () {
                $(this).removeClass('hover');
            });
        });
        W.debug--;
    }
    if (ROOT.conf.nom === 'wfmedia' || ROOT.conf.nom === 'mfal') {
        W.debug--;
    }
    if (ROOT.conf.nom === 'localhost') {
        W.debug++;
    }

    G.Load.base = {
        test: W.isIE,
        yep: [
            G.ven + 'msie/split.js',
            G.ven + 'msie/respond.min.js',
        ],
        both: [
            /*G.lib + 'video-js/ecg/video-js.css',
            G.lib + 'video-js/ecg/video.js',*/
            G.dir + 'build/libs.min.js',
        ],
        complete: function () {
            Data = new G.constructor('Data', '(catchall data fixture)');
        },
    };

    G.Load.main = {
        both: [
            G.dir + 'build/main.js',
            G.dir + '_main.js',
        ],
        complete: function () {
            _.delay(function () {
                if (W.isIE) {
                    M.load(G.ven + 'msie/selectivizr-min.js');
                }
            }, 1e3);
            Main.init();
            ROOT.loaded($);
        },
    };

    G.Load.test = {
        test: W.debug > 0,
        yep: [
            /* G.dir + '_test.js', */
        ],
        nope: [
            'http://www.wellsfargomedia.com/lib/js/ga-ecg.js',
            /*'http://www.wellsfargomedia.com/lib/video-js/videojs.ga.js',*/
            G.ven + 'sharethis.lib.js',
            G.ven + 'sharethis.cfg.js',
        ],
    };
    M.load([G.Load.base, G.Load.main, G.Load.test]);

}(jQuery, Modernizr, Glob));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
