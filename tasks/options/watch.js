module.exports = {

    // WATCH
    // https://github.com/gruntjs/grunt-contrib-watch

    options: {
        debounceDelay: 333,
    },
    cap: {
        files: ['libs/**/*.js'],
        tasks: ['jshint:precat', 'concat:libs', 'concat:boot', 'uglify'],
    },
    cat: {
        files: ['scripts/*.js'],
        tasks: ['jshint:precat', 'concat:main'],
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
        tasks: ['jshint:postcat', 'sync:update'],
    },
    warn: {
        options: { reload: !false, },
        files: ['Gruntfile.js', 'tasks/**/*'],
        tasks: ['default'],
    },
};
