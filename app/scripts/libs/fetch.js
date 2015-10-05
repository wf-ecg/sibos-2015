/*jslint white:false */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// DATA-TYPE
define(['jquery'], function ($) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Fetch',
        signature = '(url:string, cb:function)',
        expires = 100e3; // 100 seconds

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// HELPERS
    //  defaults dependancy only

    function callback() {
        C.debug.apply(C, [name, 'logback'].concat(arguments));
    }

    function Fetch(url, cb) { // CONSTRUCTOR
        if (!url) {
            throw new Error(name, signature);

        } else if (!(this instanceof Fetch)) {
            return new Fetch(url, cb); // auto-invoke as contructor
        }

        Fetch._init_(this, url, cb);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// STATIC

    Fetch._cache_ = {};

    Fetch._init_ = function (self, url, cb) {
        self.url = url;
        self.cb = (typeof cb === 'function') ? cb : callback;
        self.fresh(cb);
        Fetch._cache_[url] = self;
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// INTERNAL

    Fetch.prototype = {
        _pick: function (tag, data) {
            var str, exp, reg, arr = [];

            str = (data || this.jqxhr.responseText);
            exp = ['<', tag, '.*?>', '(.+?)', '<\\/', tag, '>']; // tag search
            reg = new RegExp(exp.join(''), 'g');

            str = str.split(/\s+/).join(' '); // compress space
            str = str.replace(/> </g, '><'); // remove tag gaps

            while ((exp = reg.exec(str))) {
                arr.push(exp[1]);
            }
            return (arr || []);
        },
        _get: function (cb) {
            var page = this;

            page.time = $.now();
            page.jqxhr = $.get(page.url, function () { // responseText
                page.body = page._pick('body')[0];
            }).fail(function () {
                C.error(arguments);
            }).always(function () {
                cb(page);
            });
        },
        _test: function () {
            var b, i, d;
            b = $('body');
            i = this.test;
            d = i.div = (i.div || $('<div id="test-page">').prependTo(b));
            d.append($('<code>' + this.body + '</code>'));
        },
        fresh: function (cb) { // check freshness and return data
            var last = Fetch._cache_[this.url];

            if (!last || (last.time + expires) < $.now()) {
                this._get(cb || this.cb);
            }
        },
    };

    return Fetch;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
