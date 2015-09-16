module.exports = {

    // UGLIFY
    // https://github.com/gruntjs/grunt-contrib-uglify

    options: {
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
};
