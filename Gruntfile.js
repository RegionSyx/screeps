module.exports = function(grunt) {

    var branch = grunt.option('branch') || "default";
    var email = grunt.option('email');
    var password = grunt.option('password');
    var ptr = grunt.option('ptr') ? true : false;

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['*.js']
            }
        }
    });
}
