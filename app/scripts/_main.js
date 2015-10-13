/*jslint white:false */
/*global _, ShareStrings:true */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 kicker and binder

 TODO
 document a bit
 modernize

 */
define(['jquery', 'banner', 'extract', 'mobile', 'modal', 'popup', 'jsmobi', 'jsview'], function
    ($, Banner, Extract, Mobile, Modal, Popup, jsMobi, jsView) { // IIFE
    'use strict';

    var W = (W && W.window || window), C = (W.C || W.console || {});
    var name = 'Main',
        self = {},
        Df, cfArr;

    Df = {// DEFAULTS
        inits: function () {
            self.isInited = true;

            if (jsView.device.width < 800) {
                jsMobi.insist('ask');
            } else {
                jsMobi.insist();
            }
            C.info('Main init @ ' + Date(), {
                debug: W.debug,
            });
        },
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// HANDLERS

    function _bindModal() {
        $('.modal').first().appendTo('body');

        var dialog = $('.modal .dialog'); // thing to show
        var triggers = $('#stickyBar .shares a'); // intercept these

        Modal.bind(triggers, dialog, function (evt) {
            var ele = evt.delegateTarget;
            dialog.find('.utilitybtn') // find the go button
                .attr({// transfer linkyness
                    href: ele.href,
                    target: ele.target,
                });
        });
    }

    function _whatPage(x) {
        x = x || W.location.pathname;
        return x.split('/').slice(-1).toString();
    }

    function _noExt(x) {
        x = x.split('.');
        return x.slice(0, 1).toString();
    }

    function _device() {
        if (!jsMobi.any()) {
            $('html').addClass('desktop');
        } else {
            $('html').addClass('mobile');
        }
    }

    function _activeNav() {
        var page = (' ' + W.location.pathname).split('/').pop();
        $('a[href="./' + page + '"]').first().addClass('active');
    }

    function startRotator(i, e) {
        var div = $(e);
        var all = div.find('a');
        var next = -1;
        var ln = all.length;
        var time = 5555;
        var fade = time / 5;
        var loop;

        // hide lock parent size
        all.hide().first().show();
        div.height(div.height());
        all.css('position', 'absolute');

        loop = function () {
            all.eq(next).fadeOut(fade).end() //
                .eq(next = (next + 1) % ln).fadeIn(fade);
            // repeat every 5 seconds
            W.setTimeout(loop, time);
        };
        loop();
    }

    function fixExternal() {
        $('.external').attr({
            title: 'Opens external site',
        });
        $('a.external, .external a').attr({
            target: 'external',
        });
    }

    function watchInputDevice() {
        $('body').on('keydown', function () {
            $(this).removeClass('mouse');
            $(this).addClass('keyboard');
        }).on('mousemove', function () {
            $(this).removeClass('keyboard');
            $(this).addClass('mouse');
        });
    }

    function _binder() {
        _device();
        _activeNav();
        _bindModal();

        $('p.rotator').each(startRotator);

        $('body').removeClass('loading');

        if (C && C.groupCollapsed) {
            C.groupEnd();
        }

        if (W.isIE) {
            $(function () {
                $('html').addClass('msie');
                $('body').on('mouseover', '.region, .widget, a, li', function () {
                    $(this).addClass('hover');
                }).on('mouseout', '.region, .widget, a, li', function () {
                    $(this).removeClass('hover');
                });
            });
        }
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /// INTERNAL

    function _init() {
        if (self.isInited) {
            return null;
        }
        Df.inits();

        fixExternal();
        watchInputDevice();
        Extract.init();

        if (_whatPage() === 'mini.html') {
            Extract.nav($.Deferred()).done(function () {
                Banner.init();
                Mobile.init(self, Extract);
                _binder();
            });
        } else {
            Extract.head($.Deferred()).done(function () {
                Banner.init();
                _binder();
            });
        }

        Popup.init(self);
    }

    $.extend(self, {
        _: function () {
            return Df;
        },
        __: Df,
        init: _init,
        mobile: !!jsMobi.any(),
        noext: _noExt,
        page: _whatPage,
        cb: function () {
            C.debug.apply(C, [name, 'callback'].concat(arguments));
        },
    });

    return self;
});
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*



 */
