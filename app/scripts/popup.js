/*jslint white:false */
/*global _, Main, videojs, */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 popup background and display media

 TODO
 document a bit
 modernize

 */
define(['jquery', 'jsview'], function ($, jsView) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Popup',
        self = {},
        Df;
    var Main;

    Df = {// DEFAULTS
        inits: function () {
            self.isInited = true;
        },
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _pic(i, e) {
        var lnk = $(e),
            pic = $('#' + lnk.data('title')),
            div = pic.parent();

        lnk.bind('click', function (evt) {
            evt.preventDefault();
            div.trigger('show.pic');
        });

        if (div.data('pic')) {
            return; // already bound
        }

        div.appendTo('body') //
            .data('pic', true) //
            .bind('show.pic', function () {
                div.addClass('big');

            }).bind('hide.pic', function () {
            div.removeClass('big');

        }).bind('mouseup', function (evt) {
            var who = evt.target.className.match('popup');

            if (who && who.length) {
                div.trigger('hide.pic');
            }
        });
    }

    function linkVid(evt) {
        var me, stub;

        me = $(evt.currentTarget);
        stub = me.data('src');

        me.attr({
            href: '//www.youtube.com/embed/' + stub + '?rel=0&html5=1',
            target: '_blank',
        });
        return true;
    }

    function embedVid(evt) {
        var me, stub, vid, ifr, mod, tmp;
        evt.preventDefault();

        me = $(evt.currentTarget);
        stub = me.data('src');
        vid = $('div.modal.popup').addClass('big');
        ifr = vid.find('iframe');

        ifr.attr({
            src: '//www.youtube.com/embed/' + stub + '?rel=0&html5=1',
        });
        vid.one('click', function () {
            ifr.attr('src', '//www.youtube.com/embed/#?rel=0&html5=1');
            vid.removeClass('big');
        });
    }

    function _binding() {
        try {
            if (!Main.mobile) {
                $('a.popup.pic').each(_pic);
                $('a.popup.vid').on('click touchend', function (evt) {
                    return jsView.mobile.agent() ? linkVid(evt) : embedVid(evt); // linkVid is used since mobile.agent returns for ipads
                });
            }
        } catch (err) {
            return err;
        }
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    function _init(m) {
        if (self.isInited) {
            return null;
        }
        Main = m;

        Df.inits();
        _binding();
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        init: _init,
    });

    return self;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
