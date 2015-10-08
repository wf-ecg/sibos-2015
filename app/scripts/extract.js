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
        Df, El;

    Df = {// DEFAULTS
        recent: null,
        home: 'h1 img.home',
        navurl: '_nav.html',
        partsurl: '_parts.html',
        point: 'section.port',
        container: '.content',
        extracts: {},
        sources: {},
        inits: function () {
            self.isInited = true;
            $.reify(El);

            // this.point  set later after mobile loads?
        },
    };
    El = {// ELEMENTS
        holder: '<article>',
        home: 'h1 img.home',
        mobileEle: '#Mobile',
        headerEle: 'header',
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    // HELPERS (defaults dependancy only)

    function callback() {
        C.debug.apply(C, [name, 'callback'].concat(arguments));
    }

    function append(page, sel) {
        // this will only parse the children of top elements [html/body/head]
        Df.recent = $(page.body).scout(sel || Df.container).children();
        Df.extracts[page.url].append(Df.recent);
    }

    function takeSource(url, cb) {
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

        Df.extracts[url] = El.mobileEle;

        if (El.mobileEle.children().length) {
            return defer.resolve();
        }
        return takeSource(url, function (page) {
            append(page, '#Mobile');
            Df.point = El.mobileEle.find(Df.point).first();
        }).jqxhr.promise(defer);
    }

    function _loadHead(defer) { // get nav html
        var url = Df.partsurl;

        Df.extracts[url] = El.headerEle;

        if (El.headerEle.children().length) {
            return defer.resolve();
        }
        return takeSource(url, function (page) {
            append(page, 'header');
        }).jqxhr.promise(defer);
    }

    function _extract(url, naving) { // get content html
        var jq = Df.extracts[url];

        if (!jq) { // never loaded
            jq = El.holder.hide().clone();
            Df.extracts[url] = jq.appendTo(Df.point);

            takeSource(url, function (page) {
                append(page);
                miniScrub(Df.extracts[url]);
                El.home.clone() //
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
