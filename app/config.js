/*jslint white:false */
/*global require, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var W = (W && W.window || window), C = (W.C || W.console || {});

W.SHIET = {};
W.debug = 0;

require.config({
    baseUrl: 'scripts',
    paths: {
        lr: 'http://localhost:7156/livereload.js?snipver=1',
        lib: 'libs',
        ven: '../vendor',
        jquery: '/lib/jquery/1.8.2/jquery',
        lodash: '/lib/underscore/js-1.4.4/lodash.underscore',
        modern: '/lib/modernizr/2.6.2/modernizr.min',
        videojs: '/lib/video-js/ecg/video',
    }
});

require(['modern', 'lib/console'], function () {
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
            C.log('LiveReloading');
        }
    } catch (err) {
        C.error('config', err);
    }
});

require(['main']);

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
