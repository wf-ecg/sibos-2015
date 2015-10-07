/*jslint white:false */
/*global define, ga, Stats:true, */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 recreated drt 2015-10

 USE
 singleton
 instantiate a beacon to time page interactions
 check events for set interval (def:1.5s)
 message event updates to Google Analytics

 TODO
 document a bit
 integrate with beacon better
 */

define(['jquery', 'lodash', 'ven/ecg-beacon'], function
    KLASS($, _, Beacon) {
    'use strict';

    var Nom = 'Stats', self;
    var W = (W && W.window || window), C = (W.C || W.console || {});
    var Db = W.debug > 0;
    var Df = {// DEFAULTS
        controls: 'a, button',
        key: 'ECG-Stats',
        lastAction: null,
        time: 1.5,
    };

    function Stats() {
    }

// HELPERS (defaults dependancy only)
    function _dump(msg) {
        if (Db && msg) {
            C.debug(Nom, '(dump)', [Df.key, msg]);
        }
    }
    function _send(msg) {
        if (W.ga) {
            ga('send',
                'event', // hit type
                Df.key, //  category
                msg, //     action, // [label], // [value],
                {'nonInteraction': true} // EvtCf?
            );
        }
    }

// PRIVATE
    function _getActive() {
        if (W.lastAction !== Df.lastAction) {
            Df.lastAction = W.lastAction;
            self.update(Df.lastAction);
        }
    }
    function _getString(me) {
        return (me.children()[0] ||
            me.get(0)).innerText ||
            me.attr('href') ||
            me.children().first().attr('alt');
    }
    function _makeMessage(evt) {
        var me, msg, str, tag, type;

        me = $(evt.currentTarget);
        msg = me.data('stat') || '';
        str = _getString(me);
        tag = me.prop('tagName');
        type = evt.type;

        if (!msg) {
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
        }
        if (msg) {
            msg = type + ':' + msg;
        }
        return msg;
    }
    function _bindings() {
        Df.beacon = new Beacon(Df.time * 10, Df.key);

        $('body').on('click keypress', Df.controls, function (evt) {
            W.lastAction = _makeMessage(evt);
        });
        W.setInterval(_getActive, Df.time * 100); // record last activity
    }

// PUBLIC
    function update(msg) {
        (W.ga ? _send : _dump)(msg);
    }
    function init(key, sel) {
        if (Db) {
            self.Df = Df;
            C.debug('[[init]]', self);
        }
        Df.key = key || Df.key;
        Df.controls = sel || Df.controls;

        _bindings();
        return self;
    }

// INIT
    self = new Stats();

    $.extend(true, self, {
        init: _.once(init),
        update: _.debounce(update, Df.time * 1000),
    });

    return self;
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
 *  SYNTAX 1                    // Value     Type     Required   Description
 *  ga('send', 'event',
 *     'category',              // Category  String   Yes        Typically the object that was interacted with (e.g. button)
 *     'action',                // Action    String   Yes        The type of interaction (e.g. click)
 *      'opt_label',            // Label     String   No         Useful for categorizing events (e.g. nav buttons)
 *      'opt_value',            // Value     Number   No         Values must be non-negative. Useful to pass counts (e.g. 4 times)
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
