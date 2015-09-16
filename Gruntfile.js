module.exports = function (grunt) {

    var conf = {
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js',
                'src/**/*.js', 'test/**/*.js', 'libs/*.js', 'scripts/*.js',
                'app/**/*.js', '!app/build/**/*.js', '!app/vendor/**/*.js'],
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
            boot: {
                options: {
                    sourceMap: false, // see uglify for map
                },
                files: {
                    'app/build/boot.js': ['libs/_boot/*.js'],
                },
            },
            libs: {
                options: {
                    sourceMap: false, // see uglify for map
                },
                files: {
                    'app/build/libs.js': ['libs/**/*.js', '!libs/_boot/**'],
                },
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
            boot: {
                options: {
                    sourceMap: false,
                },
                files: {
                    'app/build/boot.min.js': ['app/build/boot.js'],
                }
            },
            libs: {
                options: {
                    sourceMap: false,
                },
                files: {
                    'app/build/libs.min.js': ['app/build/libs.js'],
                }
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
                updateOnly: false,
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
                debounceDelay: 33,
            },
            cap: {
                files: ['libs/**/*.js'],
                tasks: ['jshint', 'concat:libs', 'concat:boot', 'uglify'],
            },
            cat: {
                files: ['scripts/*.js'],
                tasks: ['jshint', 'concat:main'],
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

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass:full', 'sync:clean']);
    grunt.registerTask('watcher', ['connect:full', 'watch']);

};
