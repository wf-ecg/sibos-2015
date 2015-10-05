/*jslint white:false */
/*global _ */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 page parser and storage

 TODO
 document a bit
 modernize

 */
define(['jquery', 'fetch', 'mobile'], function
    ($, Fetch, Mobile) {
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Extract',
        self = {},
        Df;

    Df = {// DEFAULTS
        recent: null,
        holder: '<article>',
        home: 'h1 img.home',
        mobileEle: '#Mobile',
        headerEle: 'header',
        navurl: '__nav.html',
        headurl: '__head.html',
        point: 'section.port',
        container: '.content',
        extracts: {},
        sources: {},
        inits: function () {
            self.isInited = true;

            this.mobileEle = $(this.mobileEle);
            this.headerEle = $(this.headerEle);
            // this.point  set later after mobile loads?

            C.debug(name, 'Df.inits\n', Df);
        },
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // HELPERS (defaults dependancy only)

    function callback() {
        C.debug.apply(C, [name, 'callback'].concat(arguments));
    }

    function append(page, sel) {
        // this will only parse the children of top elements [html/body/head]
        Df.recent = $(page.body).scout(sel || Df.container).children();
        return Df.extracts[page.url].append(Df.recent);
    }

    function takeSource(url, cb) {
        C.debug(name, 'takeSource', url);

        Df.sources[url] = new Fetch(url, cb || callback);
        return (Df.sources[url]);
    }

    function miniScrub(jq) {
        var hold = $('<div>');              // make new bucket
        jq.scout('.mini').children().appendTo(hold);
        jq.empty();                         // rinse out non-mini nodes
        jq.append(hold.children());         // bring back mini elements
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// INTERNAL

    function _loadNav(defer) { // get nav html
        var url = Df.navurl;

        Df.extracts[url] = Df.mobileEle;

        if (Df.mobileEle.children().length) {
            return defer.resolve();
        }
        return takeSource(url, function (page) {
            append(page, '#Mobile');
            Df.point = Df.mobileEle.find(Df.point).first();
            Df.home = $(Df.home).detach();
        }).jqxhr.promise(defer);
    }

    function _loadHead(defer) { // get nav html
        var url = Df.headurl;

        Df.extracts[url] = Df.headerEle;

        if (Df.headerEle.children().length) {
            return defer.resolve();
        }
        return takeSource(url, function (page) {
            append(page, 'header');
        }).jqxhr.promise(defer);
    }

    function _extract(url, naving) { // get content html
        var jq = Df.extracts[url];

        if (!jq) { // never loaded
            jq = $(Df.holder).hide();
            Df.extracts[url] = jq.appendTo(Df.point);

            takeSource(url, function (page) {
                append(page);
                miniScrub(Df.extracts[url]);
                Df.home.clone() //
                    .prependTo(jq).add('header') //
                    .click(Mobile.home);
            });
        }
        naving.resolve(jq);
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init() {
        if (self.isInited) {
            return null;
        }
        Df.inits();

        // extend jquery
        $.fn.scout = function (sel) { // find and/or filter
            return this.filter(sel).add(this.find(sel));
        };

    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        init: _init,
        page: _extract,
        nav: _loadNav, // bespoke vers of extract
        head: _loadHead, // bespoke vers of extract
    });

    return self;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
