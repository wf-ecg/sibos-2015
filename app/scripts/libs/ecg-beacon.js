/*jslint white:false, -W069, -W009 */
/*global define, ga, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10-09

 USE
 constructor
 set interval buffer (def:15s) for analytics interaction event

 TODO
 document a bit

 */
define(function () {
    'use strict';

    var Api,
        Nom = 'Beacon',
        W = (W && W.window || window),
        C = (W.C || W.console),
        Df;

    Df = {
        act: 'mousemove',
        lab: 'interaction',
        ua: 'UA-5483042-1',
        goog: '//www.google-analytics.com/analytics.js',
    };

    function isogram(i, s, o, g, r, a, m) { // from google
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

// HELPERS (top dependancy only)
    function _dump() {
        _log(Nom, '(dump)', arguments[1]);
    }
    function _log() {
        if (C.debug.apply) {
            C.debug.apply(C, arguments);
        } else {
            C.log(arguments); // IE
        }
    }
    function _now() {
        return (1 * new Date());
    }

// EXPOSED (prototype interface)
    Api = {
        _: Nom,
        nom: Nom,
        db: null,
        interval: 15,
        throttle: function (func, wait) { // from lodash
            var args, result, thisArg,
                previous = _now(),
                timeoutId = null;
            function trailingCall() {
                previous = _now();
                timeoutId = null;
                result = func.apply(thisArg, args);
            }
            return function () {
                var now = _now(),
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
        sendBeacon: function () {
            (W.ga ? W.ga : _dump)('send', {
                hitType: 'event',
                eventCategory: this.nom,
                eventAction: Df.act,
                eventLabel: Df.lab,
                eventValue: this.interval, // seconds > 0
            });
        },
        makeLimitedSend: function () {
            var self = this;
            _log(this.nom, W.ga ? 'running' : 'debugging', this);

            return this.throttle(function () {
                self.sendBeacon();
            }, this.interval * 1000);
        },
        init: function (sec) {
            this.db = W.debug > 0;
            this.interval = sec ? sec : this.interval;

            if (!W.ga && !this.db) { // loaded analytics?
                isogram(W, W.document, 'script', Df.goog, 'ga');
                W.ga('create', Df.ua, 'auto');
                W.ga('send', 'pageview');
            }

            this.init = W.addEventListener ? // respond to any movement
                W.document.addEventListener(Df.act, this.makeLimitedSend()) :
                W.document.attachEvent('on' + Df.act, this.makeLimitedSend()); // IE
            delete this.init; // prevent reinit
        },
    };

// CONSTRUCT
    function Beacon(sec, nom) {
        this.constructor = Beacon;
        if (nom) {
            this.nom = nom;
        }
        this.init(sec, nom);
    }
    Beacon.prototype = Api;
    return Beacon;
});
