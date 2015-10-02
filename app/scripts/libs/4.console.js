/*jslint white:false */
/*globals $, C:true, W:true, window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var i, W = (W || window), C = (C || W.console || {
    log: function () {}
});

(function (c) {
    var all, key; //  bondo stuff
    all = 'log quebug delay'.split(' ');
    for (; Boolean(key = all.shift()); ) c[key] = c[key] || c.log;
    W.C = W.console = c;
}(function () {
    try {
        return C || C.log();
    } catch (e) {
        W.alert('Minimum requirement: IE8 or greater.\n' + e);
    }
}()));

if (W.window !== window || !C.debug) {
    W = W.window;
    C.all = 'log info error warn'.split(' '); // supplant these
    for (; Boolean(i = C.all.shift()); ) C[i] = (function (fn) {
        return (typeof fn === 'function') ? fn : function () {
            if (fn) fn(Array.prototype.slice.call(arguments).join(', '));
        }; // close over the itr key function ref
    }(C[i]));
    C.all = ('assert clear count debug dir dirxml' + // alias the rest
    ' exception group groupCollapsed groupEnd markTimeline' + //
    ' profile profileEnd time timeEnd trace').split(' ');
    for (; Boolean(i = C.all.shift()); )(function (key) {
        C[key] = function () {
            C.info(Array.prototype.slice.call(arguments).join(', ') + '<' + key);
        }; // close over the itr key
    }(i));
    C.debug('IE8+', 'window / console fixes');
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
