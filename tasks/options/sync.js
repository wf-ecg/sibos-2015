module.exports = {

    // CONNECT
    // https://github.com/tomusdrw/grunt-sync

    clean: {
        files: [ {
            cwd: 'app',
            src: ['**/*'],
            dest: '/web/<%= pkg.group %>/',
        }],
        //pretend: true,
        updateOnly: false,
        verbose: true,
    },
    update: {
        files: [ {
            cwd: 'app',
            src: ['**/*'],
            dest: '/web/<%= pkg.group %>/',
        }],
        //pretend: true,
        updateOnly: true, // Don't remove any files from `dest` (works around 30% faster)
    },
};
