/*jslint white:false */
/*global require, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var W = (W && W.window || window), C = (W.C || W.console || {});

W.SHIET = {};
W.debug = 0;

require.config({
    baseUrl: 'scripts',
    paths: {
        lr: 'http://localhost:7943/livereload.js?snipver=1',
        lib: 'libs',
        ven: '../vendor',

        jquery: '/lib/jquery/1.8.2/jquery',
        lodash: '/lib/underscore/js-1.4.4/lodash.underscore',
        modern: '/lib/modernizr/2.6.2/modernizr.min',

        console: 'libs/console',
        util: 'libs/util',
        glob: 'libs/glob',
        fetch: 'libs/fetch',

        jsmobi: 'libs/js-mobi',
        jsview: 'libs/js-view',
        jqxtn: 'libs/jq-xtn',
    },
//    shim: {
//        main: {
//            deps: ['_main'],
//            exports: 'Main',
//        },
//    }
});

require(['ven/slice', 'ven/es5-shim', 'modern', 'lodash', 'console'], function () {
    try {
        W.SHIET.init();

        if (W.SHIET.trident) { // debug IE less
            W.debug--;
        }
        if (W.location.hostname === 'localhost') { // debug local more
            if (W.debug > 0) {
                $('html').addClass('debug');
            }
            W.debug++;
        }
        if (W.debug > 0) { // any debug should attempt livereload
            require(['lr']);
            C.warn('LiveReloading');
        }
    } catch (err) {
        C.error('config', err);
    }

    /// CUSTOM

    if (W.isIE) {
        require(['ven/msie/split', 'ven/msie/respond.min']);
    }

    require(['jqxtn', 'glob'], function () {
        W.ShareStrings = {};
        W.switchTo5x = true;

        require(['_main'], function (Main) {
            Main.init();

            _.delay(function () {
                if (W.isIE) {
                    require(['ven/msie/selectivizr-min']);
                }
                if (W.debug < 1) {
                    require(['http://www.wellsfargomedia.com/lib/ga/ecg']);
                }
            }, 1e3);
        });
    });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
