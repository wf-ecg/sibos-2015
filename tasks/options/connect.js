module.exports = {

    // CONNECT
    // https://github.com/gruntjs/grunt-contrib-connect

    options: {
        livereload: '<%= pkg.port0 %>',
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
};
