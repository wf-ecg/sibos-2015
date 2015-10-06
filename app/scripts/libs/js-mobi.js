/*jslint white:false */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
if (typeof define !== 'function') {
    define = function () {
        jsMobi = arguments[1]();
    };
}
define([], function () { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var N = W.navigator,
        name = 'jsMobi',
        main = 'home.html',
        mini = 'mini.html',
        self = {};

    function _pick() {
        if (!self.any()) {
            W.location = main;
        } else {
            W.location = mini;
        }
    }

    function _insist(how) {
        var cf, confirm;

        self._cf = cf = {
            gentle: (how === 'ask'),
            roving: !W.location.href.match(mini),
            smallish: !!self.any(),
        };
        confirm = function () {
            var msg = ['You seem to be using a handheld device.',
                'Do you want the mobile site?'];
            return W.confirm(msg.join('\n'));
        };

        if (cf.smallish && cf.roving) {
            if (cf.gentle && confirm()) {
                W.location = mini;
            }
        } else if (!cf.smallish && !cf.roving) {
            W.location = main;
        }
    }

    self = {
        autoPick: _pick,
        insist: _insist,
        android: function () {
            return N.userAgent.match(/Android/i);
        },
        blackberry: function () {
            return N.userAgent.match(/BlackBerry|\(BB|PlayBook/i);
        },
        ios: function () {
            return N.userAgent.match(/iPhone|iPad|iPod/i);
        },
        opera: function () {
            return N.userAgent.match(/Opera Mini/i);
        },
        windows: function () {
            return N.userAgent.match(/IEMobile/i);
        },
        generic: function () {
            return N.userAgent.match(/Mobile|BrowserNG/i);
        },
        any: function () {
            return (self.android() || self.blackberry() || self.ios() || self.opera() || self.windows() || self.generic() || false);
        },
        not: function () {
            return !self.any();
        },
        scan: function () {
            var nom;
            nom = nom || self.android() && 'android';
            nom = nom || self.blackberry() && 'blackberry';
            nom = nom || self.ios() && 'ios';
            nom = nom || self.opera() && 'opera';
            nom = nom || self.windows() && 'windows';
            nom = nom || self.generic() && 'generic';
            return nom;
        },
        show: function () {
            W.alert(self.scan() || 'immobile');
        },
    };

    return self;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*

 Change the onclick handler to a ontouch handler for mobile devices to get rid of the 300ms delay.
 var hasTouch = 'ontouchstart' in document.documentElement;
 var ismobi = navigator.userAgent.match(/Mobi/i);

 */
