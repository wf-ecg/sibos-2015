/*jslint white:false, laxcomma:true */
/*globals define */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 created drt 2015-09

 USE
 single use
 create command object for manipulating lightbox

 TODO
 document a bit

 */
define(['jquery'], function ($) {
    'use strict';

    var Nom = 'Modal';
    var W = (W && W.window || window), C = (W.C || W.console || {});
    var Db = W.debug > 1;
    var Df, El, self;

    var Act = 'keypress click';
    var cleanup = $.Callbacks();

    // DEFAULTS
    Df = {
        inited: false,
        begin: '<span class="ada" tabindex="0"> Beginning of dialog content </span>',
        closer: '<a class="closer" href="#"><span class="ada"> Close </span></a>',
        finish: '<span class="ada" tabindex="0"> End of dialog content </span>'
    };
    // ELEMENTS
    El = {
        closers: '.closer, .cancel', // all "closers"
        modal: 'body > div.modal', // only top level containers
        watcher: 'body',
    };

    // EXTEND
    $.reify = function (x, y) { // jq-reify props w/selector vals
        $.each(x, function (i, e) {
            x[i] = $(e);
        });
        return y ? $.extend(y, x) : x; // extend optional host
    };

    $.fn.contains = function (x) {
        return Boolean(this.is(x) || this.has(x).length);
    };

    $.fn.addCloser = function () {
        if (Df.closer && !this.contains('.closer')) {
            El.closers = El.closers.add($(Df.closer).prependTo(this));
        }
        return this;
    };

//  PRIVATE
    self = {
        bind: function (source, target, fixer, cleaner) {
            self.init(); // double check

            var data = {
                source: $(source),
                target: $(target),
                df: Df
            };

            if (data.source.length > 1) {
                return data.source.each(function (i, e) {
                    self.bind(e, target, fixer, cleaner);
                });
            } else if (data.source.data(Nom)) {
                throw new Error('Already Modal');
            }
            cleanup.add(cleaner);
            data.target.addCloser();
            /// map selectors to trigger show and callback
            data.source.on(Act, function (evt) {
                Df.trigger = this; // remember departure

                if (evt.keyCode === undefined || evt.keyCode === 13) {
                    evt.preventDefault(); // do not trigger
                } else if (evt.keyCode !== 0 && evt.keyCode !== 32) {
                    return; // allow for spacebar open
                }
                if (fixer) {
                    fixer(data);
                }
                self.show(data.target);
            }).data(Nom, data);
        },
        show: function (ele) {
            /// activate container, hide all kids, then feature one
            El.modal.addClass('active').find('> div').hide();
            if (ele && ele.length) {
                ele.fadeIn(function () {
                    ele.find('a, button') //
                        .attr('tabindex', '0') //
                        .first().focus().end() //
                        .last().one('blur', self.hide);
                });
            }
            return self;
        },
        hide: function () {
            /// deactivate container and do whatever cleaning
            El.modal.removeClass('active');
            cleanup.fire();
            Df.trigger.focus(); // restore focus
            return self;
        },
        init: function () {
            if (Df.inited) {
                return null;
            }
            if (Db) {
                C.info(Nom, 'debug:', Db, self);
                self[Nom] = Df;
            }
            Df.inited = true;
            Df.El = $.reify(El);
            El.modal.prepend(Df.begin).append(Df.finish);

            /// bind container actions to .hide
            El.modal.on(Act, function (evt) {
                var ele = $(evt.target);

                if (El.closers.contains(ele) || ele.is(El.modal)) {
                    evt.preventDefault(); // do change hash
                    self.hide();
                }
            });
            El.watcher.on('keydown', function (evt) {
                if (evt.keyCode === 27) {
                    self.hide(); // escape key
                }
            });
        }
    };

    return self;
});
