module.exports = {

    // JSHINT
    // https://github.com/gruntjs/grunt-contrib-jshint

    options: {
        force: true,
        //'-W013': true, // ???
        '-W015': true, // relax about indentation
        '-W032': true, // allow extra semi-colons
        //'-W033': true, // ???
        //'-W061': true, // ???
    },
    precat: ['libs/*.js', 'app/*.js', 'scripts/*.js'],
    postcat: ['app/*.js', 'app/build/main.js'],
};
