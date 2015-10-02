/*jslint white:false */
/*global W, C, Infinity */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function _Glob(name, desc) {
    var self = this,
        inited = false,
        parent = self.constructor || this;

    parent.noms = parent.noms || [];
    parent.objs = parent.objs || {};
    parent.inc();

    name = (name || 'Glob');
    desc = (desc || 'I’m from a lazy sod!');

    if (name in parent.objs) {
        name = (name + ':@' + parent.inc); // force unique id
    }
    self[''] = name;
    //self['Ω'] = parent;

    parent.noms.push(name);
    parent.objs[name] = self;

    self.isInited = function (b) {
        if (inited) {
            if (b)
                C.error('double init', name);
            return true;
        } else {
            if (b) { // first run, so just say no
                if (W.debug > 0)
                    C.debug('inited', name);
                inited = true;
            } else { // affirmations only!
                throw new Error(name + ' not inited');
            }
            return false;
        }
    };
    if (W.debug > 0)
        C.log('create', self, desc);
}

_Glob.addCounter = function (obj, nom) { // love this
    var num = -1,
        mod = Infinity,
        inc;

    obj = obj || this;
    inc = obj[nom || 'inc'] = function () { // always internally "inc"
        num++;
        return inc.valueOf();
    };
    inc.valueOf = function () {
        return num % mod;
    };
    inc.limitTo = function (num) {
        mod = Math.abs(parseInt(num)) || Infinity;
        return inc;
    };
    inc.reset = function () {
        num = 0;
        return inc;
    };
    return inc;
};

_Glob.prototype.addCounter = _Glob.addCounter;
_Glob.prototype.valueOf = function () {
    return this[''];
};

_Glob.addCounter();
Glob = new _Glob();
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
