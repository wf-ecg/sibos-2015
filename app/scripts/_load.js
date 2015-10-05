/*jslint white:false */
/*global _, Glob, jQuery */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var ShareStrings,
    switchTo5x = true;

(function ($) {
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});

    var ROOT = {
        doc: "/home.html",
        lib: "/lib",
        conf: {
            nom: 'localhost'
        },
        loaded: function () {
            $('body').removeClass('loading');

            if (W.debug > 0) {
                $('html').addClass('debug');
            }
            if (C && C.groupCollapsed) {
                C.groupEnd();
            }

            delete this.loaded;
        },
    };

    _.defaults(Glob, {/// all stubs terminated
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
    if (W.isIE) {
        require(['ven/msie/split', 'ven/msie/respond.min']);
    }

    _.delay(function () {
        if (W.isIE) {
            require(['ven/msie/selectivizr-min']);
        }
        if (W.debug < 0) {
            //require(['ven/sharethis.lib', 'ven/sharethis.cfg', 'http://www.wellsfargomedia.com/lib/js/ga-ecg']);
        }
    }, 1e3);

    ROOT.loaded($);

}(jQuery));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
