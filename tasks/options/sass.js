module.exports = {

    // SASS
    // https://github.com/gruntjs/grunt-contrib-sass
    //
    // sourcemap: {String}(Default: auto)
    //  auto - relative paths where possible, file URIs elsewhere
    //  file - always absolute file URIs
    //  inline - include the source text in the sourcemap
    //  none - no sourcemaps

    options: {
        compass: true,
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
};
