/*jslint white:false */
/*global _, C, W, Glob, jQuery,  Modernizr, Typekit */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var Data, Load, Tests, ShareStrings, switchTo5x = true, ROOT = {
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

(function ($, M, G) {
    'use strict';
    G.Load = {};
    W.Tests = $.Callbacks();

    _.defaults(G, {/// all stubs terminated
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

    Data = new G.constructor('Data', '(catchall data fixture)');

    _.delay(function () {
        if (W.isIE) {
            require(['ven/msie/selectivizr-min']);
        }
        if (W.debug < 1) {
            require(['ven/sharethis.lib', 'ven/sharethis.cfg', 'http://www.wellsfargomedia.com/lib/js/ga-ecg']);
        }
    }, 1e3);

    ROOT.loaded($);

}(jQuery, Modernizr, Glob));
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
