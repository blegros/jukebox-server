module.exports = function (grunt) {
    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-apidoc');

    //initialize plugin configs
    grunt.initConfig({
        clean: ['build', 'dist'],
        jshint: {
            options: {},
            src: ['src/**/*.js']
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            'unit-test': {
                src: ['test/unit/**/*Test.js']
            },
            'integration-test': {
                src: ['test/integration/**/*Test.js']
            },
            'functional-test': {
                src: ['test/functional/**/*Test.js']
            }
        },
        copy: {
            //copy over everything but the configuration file
            'prepare-distribution': {
                files: [
                    //{expand: true, cwd: 'src/', src: ['**', '!config/**/*'], dest: 'dist/'}
                    {expand: true, cwd: 'src/', src: ['**'], dest: 'dist/'}
                ]
            }
        },
        express: {
            server: {
                options: {
                    server: __dirname + '/tests/functional/bootstrap.js'
                }
            }
        },
        apidoc: {
            'open-jukebox': {
                src: 'src/',
                dest: 'build/apidoc/',
                options: {
                    log: true,
                    includeFilters: [ ".*\\.js$" ]
                }
            }
        }
    });

    //define tasks
    grunt.registerTask('init', function () {
        var fs = require("fs");

        console.log("Creating build and dist dirs...");

        fs.mkdirSync('build');
        fs.mkdirSync('dist');
    });

    grunt.registerTask('unit-test', ['clean', 'init', 'mochaTest:unit-test']);
    grunt.registerTask('integration-test', ['clean', 'init', 'mochaTest:integration-test']);
    grunt.registerTask('functional-test', ['clean', 'init', 'copy:prepare-distribution', 'express', 'mochaTest:functional-test', 'express-stop']);
    grunt.registerTask('default', ['clean', 'init', 'jshint', 'mochaTest:unit-test', 'mochaTest:integration-test', 'copy:prepare-distribution', 'express', 'mochaTest:functional-test', 'express-stop', 'apidoc']);
};