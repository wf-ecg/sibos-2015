module.exports = function(grunt) {
    var conf = {};

    // Load tasks from the tasks folder
    grunt.loadTasks('tasks');

    // Utility to load the different option files based on their names
    function dirlist(path) {
        return require('glob').sync('*', path ? {
            cwd: path,
        } : '');
    }

    function gluejs(path) {
        var obj = {};

        dirlist(path).forEach(function (opt) {
            var key = opt.replace(/\.js$/, '');

            obj[key] = require(path + opt);
            grunt.log.writeln('\nGLUEJS', key, '\n', [obj[key]]);
        });

        return obj;
    }

    function evaljs(path) {
        var obj = {};

        dirlist(path).forEach(function (opt) {
            var key = opt.replace(/\.js$/, '');
            var str = grunt.file.read(path + opt);

            obj[key] = eval(str);
            // grunt.log.writeln('\n EVALJS', key, 'STR\n', str);
        });

        return obj;
    }
    //console.log('EVALJS', [evaljs('./tasks/options/')]);

    // Start initial config object
    conf.pkg = grunt.file.readJSON('./package.json');

    // Load tasks/options by the name: watch.js => watch{}
    grunt.util._.extend(conf, evaljs('./tasks/options/'));
    grunt.initConfig(conf);

    //console.log('1', grunt.config.get('connect.base.options'));
    console.log('\n\n\n\n* * * * * * * * Big old grunt load * * * * * * * * *');
    //console.log('2', conf === grunt.config.data, dirlist());

    require('load-grunt-tasks')(grunt);
};
