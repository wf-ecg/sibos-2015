/*jslint white:false */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
define(['jquery'], function ($) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var D = W.document,
        E = D.documentElement,
        S = W.screen,
        name = 'jsView',
        self = {};

    self.device = {
        client: W.navigator.userAgent,
        ppp: W.devicePixelRatio,
        resolution: W.devicePixelRatio,
    };
    $.extend(self.device, W.screen);

    self.port = {
        ie: ('v' === '\v'), // !!window.ActiveXObject
        density: self.device.ppp, // resolution "pixels per pixel" factor
        aspect: function () {
            return this.visualWidth() / this.visualHeight();
        },
        layoutWidth: function () {
            return S.width;
        },
        layoutHeight: function () {
            return S.height;
        },
        visualWidth: function () {
            return this.ie ? E.offsetWidth : W.innerWidth;
        },
        visualHeight: function () {
            return this.ie ? E.offsetHeight : W.innerHeight;
        },
        orientation: function () {
            var diff = this.aspect();

            if (diff > 0.9 && diff < 1.1) {
                return 'square';
            }
            return diff > 1 ? 'landscape' : 'portrait';
        },
        scrollbarWidth: function () {
            return W.outerWidth - W.innerWidth;
        },
        _widths: function () {
            return {
                s: ['width/' + S.width,
                    'availW/' + S.availWidth] + String(),
                w: ['innerW/' + W.innerWidth,
                    'outerW/' + W.outerWidth] + String(),
                e: ['offsetW/' + E.offsetWidth,
                    'clientW/' + E.clientWidth,
                    'scrollW/' + E.scrollWidth] + String(),
            };
        },
    };

    self.mobile = {
        bugged: false,
        addBug: function () {
            if (this.bugged) {
                return;
            }
            $('<cite class="bug">M</cite>').css({
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '2px',
                bottom: '-2px',
                color: 'white',
                fontStyle: 'normal',
                opacity: '0.5',
                padding: '0 2px',
                position: 'fixed',
                right: '-1px',
                zIndex: '9999',
            }).appendTo('body');

            this.bugged = true;
        },
        agent: function () {
            var vis = self.port.visualWidth(),
                mob = (/mobi|android/i).test(self.device.client),
                dev = (/chrome/i).test(self.device.client);

            if ((vis < 973 && vis % 10 === 3) && dev) {
                // chrome webdev responsive layouts add 13px
                mob = true;
                this.addBug();
            }
            if (mob) {
                mob = W.navigator.platform;
            }
            return mob;
        },
        zoomed: function () {
            return self.port.layoutWidth() / self.port.visualWidth();
        },
    };

    return self;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*

 TODO: integrate into other js-view efforts

 */
