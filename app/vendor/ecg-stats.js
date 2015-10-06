/*jslint white:false */
/*global define, ga, Stats:true, */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-09

 USE
 singleton to message event updates to Google Analytics

 TODO
 document a bit
 */

define(['jquery', 'lodash'], function
    KLASS($, _) {
    'use strict';

    var Nom = 'Stats', self;
    var W = (W && W.window || window), C = (W.C || W.console || {});
    var Db = W.debug > 0;
    var Df = {// DEFAULTS
        controls: 'a, button',
        key: 'WfW-Q4',
        lastAction: null,
        time: 1500,
    };

// HELPERS (defaults dependancy only)
    function Stats() {
    }
    function dump(msg) {
        if (Db && msg) {
            C.info(Nom, '(dump)', [Df.key, msg]);
        }
    }
    function send(msg) {
        if (W.ga) {
            ga('send', 'event', Df.key, msg, {
                'nonInteraction': true
            });
        }
    }

// PRIVATE
    function _getActive() {
        if (W.lastAction !== Df.lastAction) {
            Df.lastAction = W.lastAction;
            self.update(Df.lastAction);
        }
    }
    function _makeMessage(evt) {
        var me, msg, str, tag, type;

        me = $(evt.currentTarget);
        msg = me.data('stat') || '';
        str = (me.children()[0] || me.get(0)).innerText || me.attr('href');
        tag = me.prop('tagName');
        type = evt.type;

        if (!msg)
            switch (tag) {
                case 'A':
                    msg = ('Link:' + str);
                    break;
                case 'BUTTON':
                    msg = ('Button:' + me.get(0).textContent);
                    break;
                default:
                    msg = me.parent().get(0).className;
            }
        if (msg) {
            msg = msg + ':' + type;
        }
        return msg;
    }

// PUBLIC
    function update(msg) {
        (W.ga ? send : dump)(msg);
    }
    function init() {
        $('body').on('click keypress', Df.controls, function (evt) {
            W.lastAction = _makeMessage(evt);
        });

        if (Db) {
            self.Df = Df;
            C.log(Nom + '[[init]]', self);
        }
        W.setInterval(_getActive, Df.time);
        return self;
    }

// INIT
    self = new Stats();

    $.extend(true, self, {
        init: _.once(init),
        update: _.debounce(update, Df.time),
    });

    return self;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
 *  SYNTAX 1                    // Value     Type     Required   Description
 *  ga('send', 'event',
 *      'category',             // Category  String   Yes        Typically the object that was interacted with (e.g. button)
 *      'action',               // Action    String   Yes        The type of interaction (e.g. click)
 *          'opt_label',        // Label     String   No         Useful for categorizing events (e.g. nav buttons)
 *          opt_value,          // Value     Number   No         Values must be non-negative. Useful to pass counts (e.g. 4 times)
 *      {'nonInteraction': 1}   // EvtCf?    Field    No         Key/Value pairs define specific field names and values accepted by analytics.js
 *  );
 *
 *  SYNTAX 2 (send by passing a configuration field)
 *  ga('send', {
 *      'hitType': 'event',          // Required.
 *      'eventCategory': 'button',   // Required.
 *      'eventAction': 'click',      // Required.
 *      'eventLabel': 'nav buttons',
 *      'eventValue': 4
 *  });
 *  Read the Field Reference document for a complete list of all the fields that can be used in the configuration field object.
 *  https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference
 *
 */
