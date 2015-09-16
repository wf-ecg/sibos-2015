/*jslint white:false, evil: true */
/*globals window */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
var W = window, /// change to Boot
C = W.console;
W.debug = Number(new Date('2015/09/29') > new Date());
W.ROOT = ({
    mode: "eval('var x=0'),(typeof(x)!=='number'?'':'non-')+'strict'",
    base: 0,
    // adjust built-in page depth? (e.g. '-1' == '..')
    conf: {
        _: { /// any top level host
            nom: '*',
        },
        'www.wellsfargomedia.com': {
            nom: 'wfmedia',
            sub: '/sibos/pages',
        },
        'ecg.hosting.wellsfargo.com': {
            lib: '//www.wellsfargomedia.com/lib',
            nom: 'mfal',
            sub: '/mfal/foo/bar',
        },
        '10.89.101.100': {
            nom: 'qla2',
            sub: '/wf-ecg/sibos-2015',
        },
        'localhost:8000': {
            nom: 'localhost',
            sub: '/wf-ecg/sibos-2015/app',
        },
        'localhost:8943': {
            nom: 'localhost',
        },
    },
    dir: null,
    doc: null,
    lib: null,
    rev: null,
    _host: function (R) { // determine config for this server
        R.conf = (R.conf[R.L.host] || R.conf._); // overwrite host hash
        R.conf.top = '//' + R.L.host;
        return (delete R._host) && R;
    },
    _tops: function (R) { // lookup main directories
        R.doc = R.L.pathname.toString().replace(R.conf.sub, '');
        // capture versioning number directory segment
        R.rev = (R.doc.match(/^(\/\d\w*)(.*)$/) || '');
        if (R.rev) {
            R.doc = R.rev[2]; // isolate file name
            R.rev = R.rev[1]; // isolate version integer
        }
        R.lib = (R.conf.lib || '/lib');
        R.dir = (R.conf.sub || '') + R.rev;
        return (delete R._tops) && R;
    },
    _down: function (R) { // levels relative to host.sub
        R.deep = R.doc.slice(1).split('/'); //  segment
        R.deep.pop(); //                        trim docname
        R.comp = R.deep.slice(0, R.base); //    hoist to top of subproject
        if (R.base && (R.deep.length + R.base) !== 0) {
            if (R.comp.length) {
                R.comp.push(''); //slash
            }
            R.base = R.L.protocol + R.conf.top + R.dir + '/' + R.comp.join('/');
        } else {
            delete R.base;
        }
        return (delete R._down) && R;
    },
    _wrap: function (R) { // write out bootstrap element
        if (R.base) {
            R.D.write('<base href="' + R.base + '">');
        }
        R.D.write('<script src="' + R.dir + '/build/boot.min.js"></script>');
        return (delete R._wrap) && R;
    },
    loaded: function ($) {
        $('body').removeClass('loading');
        if (W.debug > 0) {
            $('html').addClass('debug');
        }
        if (C && C.groupCollapsed) {
            C.groupEnd();
        }
        delete this.reload; /// retain reload if async needed
        delete this.loaded;
    },
    init: function () {
        'use strict';
        var R = this;
        R.mode = eval(R.mode);
        R.D = W.document;
        R.L = W.location;
        R._host(R)._tops(R)._down(R)._wrap(R);
        if (C && C.groupCollapsed) {
            C.groupCollapsed('ROOT', R);
        }
        return (delete R.init) && R;
    },
    reload: function () {
        var u = this.L.host.split(':');
        if (u.length === 2 && u[1] > 8000 && !W.LiveReload) {
            u = u[0] + ':' + (u[1] - 1000) + '/livereload.js?snipver=1';
            this.D.write('<script src="//' + u + '"><\/script>');
        }
    },
}.init());

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
Originally built by WF-ECG INTERACTIVE (Wells Fargo Enterprise Creative Group).
        We design and develop with a focus on web standards and best practices.
*/
