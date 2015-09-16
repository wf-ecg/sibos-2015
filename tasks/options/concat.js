module.exports = {

    // CONCAT
    // https://github.com/gruntjs/grunt-contrib-concat

    options: {
        banner: '/* = = = = = = ='
        + ' <%= pkg.name %>:'
        + ':<%= grunt.task.current.target %>:'
        + ':<%= grunt.task.current.name %>:'
        + ':<%= grunt.template.today("isoDateTime") %> '
        + '= = = = = = = */\n',
        process: function(src, filepath) {
            return ('//\n// ' + filepath + '\n//\n' + src + '\n');
        },
        separator: '/* = = = = = = = = = = */\n',
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
        options: { sourceMap: true, },
        files: {
            'app/build/main.js': ['scripts/[a-z]*.js', 'scripts/_[a-z]*.js'],
        },
    },
};

