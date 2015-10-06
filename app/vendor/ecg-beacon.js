/*jslint white:false */
/*global window, define */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
recreated drt 2015-09
 try to make analytics event for every page interaction
 prevent new events for set interval (def:15s)

 TODO
 sudo singleton --- modernize into constructor

*/
define(function () {
    'use strict';

    var Api,
        Nom = 'Beacon',
        W = (W && W.window || window),
        C = (W.C || W.console);
    var start,
        goog = '//www.google-analytics.com/analytics.js';

    function isogram(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || new Array()).push(arguments);
        };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    }

    function log() {
        if (C.log.apply) {
            C.log.apply(C, arguments);
        } else {
            C.log(arguments); // IE
        }
    }
    function time() {
        return (1 * new Date());
    }

    Api = {
        interval: 15e3, // 15 second intervals
        _: Nom,
        db: null,
        nom: Nom,
        getStart: function () {
            start = (start || time());
            return start;
        },
        getSpent: function () {
            return time() - this.getStart();
        },
        throttle: function (func, wait) {
            var args, result, thisArg,
                previous = time(),
                timeoutId = null;

            function trailingCall() {
                previous = time();
                timeoutId = null;
                result = func.apply(thisArg, args);
            }

            return function () {
                var now = time(),
                    elapsed = now - previous,
                    remaining = wait - elapsed;

                args = arguments;
                thisArg = this;

                if (remaining <= 0) { // past wait period
                    W.clearTimeout(timeoutId);
                    timeoutId = null;
                    previous = now;
                    result = func.apply(thisArg, args);
                } else if (!timeoutId) {
                    timeoutId = W.setTimeout(trailingCall, remaining);
                }
                return result;
            };
        },
        sendBeacon: function (act) {
            (W.ga ? W.ga : log)('send', {
                'eventLabel': this.nom,
                'hitType': 'event',
                'eventCategory': 'engagement',
                'eventAction': act,
                'eventValue': (this.getSpent() / 1000 | 0)
            });
        },
        makeLimitedSend: function () {
            var self = this;
            log(Nom, 'running ' + (W.ga ? 'LIVE' : 'in debug'), this);

            return this.throttle(function () {
                self.sendBeacon('movement');
            }, this.interval);
        },
        init: function (sec, nom) {
            start = time();
            this.db = W.debug > 0;
            this.interval = sec ? sec * 1000 : this.interval;

            if (!W.ga && !this.db) { // really load analytics?
                isogram(W, W.document, 'script', goog, 'ga');
                W.ga('create', 'UA-5483042-1', 'auto');
                W.ga('send', 'pageview');
            }

            this.init = W.addEventListener ? // respond to any movement
                W.document.addEventListener('mousemove', this.makeLimitedSend()) :
                W.document.attachEvent('onmousemove', this.makeLimitedSend()); // IE
            delete this.init; // prevent double-bind
        },
    };

// CONSTRUCT
    function Beacon(sec, nom) {
        if (nom) this.nom = nom;
        this.init(sec, nom);
        C.log('this', this);
        this.constructor = Beacon;
    }
    Beacon.prototype = Api;

    return Beacon;
});