module.exports = function (grunt) {

    grunt.registerTask('default', [
        'jshint:precat',
        'concat',
        'jshint:postcat',
        'uglify',
        'sass:full',
        'sync:clean',
        'connect:full',
        'watch',
    ]);

    grunt.registerTask('easy', [
        'connect:base',
        'watch',
    ]);

    grunt.registerMultiTask('wrap', 'Wraps source files with specified header and footer', function () {
        var data = this.data,
            path = require('path'),
            dest = grunt.template.process(data.dest),
            files = grunt.file.expandFiles(this.file.src),
            header = grunt.file.read(grunt.template.process(data.header)),
            footer = grunt.file.read(grunt.template.process(data.footer)),
            sep = grunt.utils.linefeed;

        files.forEach(function (f) {
            var p = dest + '/' + path.basename(f),
                contents = grunt.file.read(f);

            grunt.file.write(p, header + sep + contents + sep + footer);
            grunt.log.writeln('File "' + p + '" created.');
        });
    });

    grunt.foo = (function () {
        var out = {};
        grunt.file.expand({
            cwd: 'libs',
            filter: 'isDirectory'
        }, '*').map(function (nom) {
            out['app/build/' + nom + '.js'] = ['libs/' + nom + '/*.js'];
        });
        //console.log('GRUNT.FOO', out);
        return out;
    }());

    // grunt.registerTask('custom', 'Say hello!', function () {
    //     grunt.log.writeln("Custom task log");
    // });
    //
    // grunt.registerTask('dev', ['connect', 'watch']);

        /*
    grunt.event.on('watch', function (action, filepath, target) {
        grunt.log.writeln('\n>>WATCH<< TARGET:', target, filepath);
       var cfgkey = ['copy', 'files'];
       grunt.config.set(cfgkey, [grunt.config.get(cfgkey)].map(function(file) {
           file.src = filepath;
           return file;
       }));
    });
        */
};

/*
    * matches any number of characters, but not /
    ? matches a single character, but not /
    ** matches any number of characters, including /, as long as it's the only thing in a path part
    {} allows for a comma-separated list of "or" expressions
    ! at the beginning of a pattern will negate the match

// You can specify single files:
// Or arrays of files:

    files: { 'dest/file': 'foo/this.js' }
    files: { 'dest/file': ['foo/this.js', 'foo/that.js', 'foo/the-other.js'] }

// Or you can generalize with a glob pattern:
// This single node-glob pattern:
// Could also be written like this:

    files: { 'dest/file': 'foo/th*.js' }
    files: { 'dest/file': 'foo/{a,b}*.js' }
    files: { 'dest/file': ['foo/a*.js', 'foo/b*.js'] }

// All .js files, in foo/, in alpha order:
// Here, bar.js is first, followed by the remaining files, in alpha order:
// All files except for bar.js, in alpha order:
// All files in alpha order, but with bar.js at the end.

    files: { 'dest/file': ['foo/*.js'] }
    files: { 'dest/file': ['foo/bar.js', 'foo/*.js'] }
    files: { 'dest/file': ['foo/*.js', '!foo/bar.js'] }
    files: { 'dest/file': ['foo/*.js', '!foo/bar.js', 'foo/bar.js'] }

// Templates may be used in filepaths or glob patterns:
// But they may also reference file lists defined elsewhere in the config:

    files: { 'dest/<%= basename %>.min.js': ['src/<%= basename %>.js'] }
    files: { 'dest/file': ['foo/*.js', '<%= jshint.all.src %>'] }

    grunt.initConfig({
        uglify: {
            static_mappings: {
                files: [
                    {src: 'lib/a.js', dest: 'build/a.min.js'},
                    {src: 'lib/b.js', dest: 'build/b.min.js'},
                    {src: 'lib/subdir/c.js', dest: 'build/subdir/c.min.js'},
                    {src: 'lib/subdir/d.js', dest: 'build/subdir/d.min.js'},
                ],
            },
            dynamic_mappings: {
                files: [{
                    expand: true,     // Enable dynamic expansion.
                    cwd: 'lib/',      // Src matches are relative to this path.
                    src: ['**⁄*.js'], // Actual pattern(s) to match.
                    dest: 'build/',   // Destination path prefix.
                    ext: '.min.js',   // Dest filepaths will have this extension.
                    extDot: 'first'   // Extensions in filenames begin after the first dot
                }],
            },
        },
    });

 */
