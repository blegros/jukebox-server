module.exports = function (grunt) {

    //Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-apidoc');

    //initialize plugin configs
    grunt.initConfig({
        clean: ['build'],
        jshint: {
            options: {},
            src: ['lib/**/*.js', 'app.js', 'bootstrap.js']
        },
        exec: {
            'run-migrations-up': {
                command: 'node_modules/migrate/bin/migrate up'
            },
            'run-migrations-down': {
                command: 'node_modules/migrate/bin/migrate down'
            }
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
        express: {
            server: {
                options: {
                    server: __dirname + '/tests/functional/bootstrap.js'
                }
            }
        },
        apidoc: {
            'open-jukebox': {
                src: 'lib/',
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
        console.log("Creating ./build ...");
        grunt.file.mkdir('./build');
    });

    grunt.registerTask('reset-db', ['exec:run-migrations-down', 'exec:run-migrations-up']);
    grunt.registerTask('unit-test', ['clean', 'init', 'mochaTest:unit-test']);
    grunt.registerTask('integration-test', ['clean', 'init', 'mochaTest:integration-test']);
    grunt.registerTask('functional-test', ['clean', 'init', 'express', 'mochaTest:functional-test', 'express-stop']);
    grunt.registerTask('ci', ['clean', 'init', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop']);
    grunt.registerTask('default', ['clean', 'init', 'jshint', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop', 'apidoc']);
};