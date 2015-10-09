/*jslint  white:false, evil:true, -W011 */
/*global define, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*!
 * Console: MSIE Workarounds v1.5.6
 * Build: `node /usr/local/bin/r.js -o build.js`
 * Copyright: 2015-06-01 @ WF via drt
 * http //ecgsolutions.hosting.wellsfargo.com/wordpress/?cat=6
 */
var W = (W && W.window || window), C = (W.C || W.console || {});

define(['jquery'], function ($) {
    'use strict';

    var W = (W || window), C = (C || W.console || {
        log: function () {
        }
    });

    W.SHIET = {
        header: W.isIE,
        ltie9: function () {
            this.ltie9 = this.jqsays || eval('"\v" === "v"');
        },
        jqsays: undefined,
        gtie11: undefined,
        trident: W.navigator.userAgent.indexOf('rident') + 1,
        init: function () {
            this.jqsays = $.browser && $.browser.msie;
            this.ltie9();
            if (!$.fn)
                throw new Error('init requires jquery');
            if (this.trident && !this.jqsays)
                this.gtie11 = true;
            if (this.trident)
                $('html').addClass('msie');
            if (this.ltie9)
                $('html').addClass('ie8');
            return this;
        }
    };

    (function (c) {
        var all, i, key; //  bondo stuff
        all = 'log quebug delay'.split(' ');

        for (; Boolean(key = all.shift()); ) {
            c[key] = c[key] || c.log;
        }

        W.C = W.console = c;

        function reArg(args) {
            return Array.prototype.slice.call(args);
        }

        function makeMeth(fn) {
            // close over the itr key fn ref
            return (typeof fn === 'function') ? fn : function () {
                var i, s, args = reArg(arguments);

                for (i in args) {
                    s = args[i];
                    s = JSON.stringify(s) || s.toString();
                    args[i] = s.replace(/(\}\,)/g, '$1\n . . . .');
                }
                if (fn) {
                    fn(args.join(',  '));
                }
            };
        }

        function makeInfo(key) {
            // close over the itr key
            C[key] = function () {
                C.info(reArg(arguments).join(', ') + '<' + key);
            };
        }

        if (W.window !== window || !C.debug) {
            // probably IE
            W = W.window;
            C.all = 'log info error warn'.split(' ');
            // supplant these
            for (; Boolean(i = C.all.shift()); ) {
                C[i] = makeMeth(C[i]);
            }
            // alias the rest to .info
            C.all = ('assert clear count debug dir dirxml' +
                ' exception group groupCollapsed groupEnd markTimeline' + //
                ' profile profileEnd time timeEnd trace').split(' ');
            for (; Boolean(i = C.all.shift()); ) {
                makeInfo(i);
            }
            C.debug('IE8+', 'window / console fixes');
        }
    }(function () {
        try {
            return C || C.log();
        } catch (e) {
            W.alert('Minimum requirement: IE8 or greater.\n' + e);
        }
    }()));
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
