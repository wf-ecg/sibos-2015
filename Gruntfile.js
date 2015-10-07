module.exports = function (grunt) {

    var conf = {
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js',
                'src/**/*.js', 'test/**/*.js', 'app/scripts/**/*.js',
                '!app/build/**/*.js', '!app/vendor/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                },
                force: true,
                //'-W013': true, // ???
                '-W015': true, // relax about indentation
                '-W032': true, // allow extra semi-colons
                '-W002': true, // allow err as var
                //'-W033': true, // ???
                //'-W061': true, // ???
            }
            // https://github.com/gruntjs/grunt-contrib-jshint
        },
        //qunit: {
        //files: ['test/**/*.html']
        //},
        concat: {
            options: {
                //separator: ';',
                separator: '/* = = = = = = = = = = */\n',
                banner: '/* = = = = = = =' +
                        ' <%= pkg.name %>:' +
                        ':<%= grunt.task.current.target %>:' +
                        ':<%= grunt.task.current.name %>:' +
                        ':<%= grunt.template.today("isoDateTime") %> ' +
                        '= = = = = = = */\n',
                process: function (src, filepath) {
                    return ('//\n// ' + filepath + '\n//\n' + src + '\n');
                },
                sourceMap: true,
            },
            main: {
                options: {sourceMap: true, },
                files: {
                    'app/build/main.js': ['scripts/[a-z]*.js', 'scripts/_[a-z]*.js'],
                },
            },
            // https://github.com/gruntjs/grunt-contrib-concat
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                // beautify: true,
                compress: {
                    unused: false,
                },
                mangle: false,
            },
            // https://github.com/gruntjs/grunt-contrib-uglify
        },
        sass: {
            // SASS
            // sourcemap: {String}(Default: auto)
            //  auto - relative paths where possible, file URIs elsewhere
            //  file - always absolute file URIs
            //  inline - include the source text in the sourcemap
            //  none - no sourcemaps
            options: {
                compass: true,
                //require: 'animation',
                style: 'compact',
                update: false, /// {Boolean}(Default: false) Only compile changed files.
            },
            full: {
                files: [{
                        cwd: 'scss/',
                        dest: 'app/build/',
                        expand: true,
                        ext: '.css',
                        extDot: 'last',
                        src: ['*.scss'],
                    }],
            },
            // https://github.com/gruntjs/grunt-contrib-sass
        },
        sync: {
            // CONNECT
            clean: {
                files: [{
                        cwd: 'app',
                        src: ['**/*'],
                        dest: '/web/<%= pkg.group %>/',
                    }],
                //pretend: true,
                updateOnly: false, // true = Don't remove any files from `dest` (works around 30% faster)
                verbose: true,
            },
            update: {
                files: [{
                        cwd: 'app',
                        src: ['**/*'],
                        dest: '/web/<%= pkg.group %>/',
                    }],
                //pretend: true,
                updateOnly: true, // Don't remove any files from `dest` (works around 30% faster)
            },
            // https://github.com/tomusdrw/grunt-sync
        },
        connect: {
            // CONNECT
            options: {
                port: '<%= pkg.port1 %>',
            },
            base: {
                options: {
                    base: '<%= pkg.bases %>',
                    open: false,
                },
            },
            full: {
                options: {
                    base: '<%= pkg.bases %>',
                    //hostname: 'localhost', // Change this to '0.0.0.0' to access the server from outside
                    open: 'http://localhost:<%= pkg.port1 %>', // target url to open
                },
            },
            // https://github.com/gruntjs/grunt-contrib-connect
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint'], // , 'qunit'
            // WATCH

            options: {
                debounceDelay: 333,
            },
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:full'],
            },
            reloads: {
                options: {
                    livereload: '<%= pkg.port0 %>',
                },
                files: ['app/**/*', '!app/**/*.map'],
                tasks: ['jshint', 'sync:update'],
            },
            // https://github.com/gruntjs/grunt-contrib-watch
        },
        requirejs: {
            compile: {
                options: {
                    name: '../config',
                    mainConfigFile: 'app/config.js',
                    out: 'app/build/app.js',
                    findNestedDependencies: true,
                    fileExclusionRegExp: /^\./,
                    //baseUrl: 'path/to/base',
                    //logLevel: 0,  // http://jaketrent.com/post/run-requirejs-with-gruntjs/
                    //inlineText: true,
                    //generateSourceMaps: true,
                    optimize: 'none',
                    uglify: {
                        beautify: false,
                        max_line_length: 255,
                        no_mangle: true
                    },
                    _runcmd_: 'node /usr/local/bin/r.js -o build.js'
                },
            },
            // https://github.com/gruntjs/grunt-contrib-requirejs
        },
    };

    grunt.initConfig(conf);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', /*'concat', 'uglify',*/ 'sass:full', 'requirejs', 'sync:clean']);
    grunt.registerTask('watcher', ['connect:full', 'watch']);

};
