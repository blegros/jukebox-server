module.exports = function (grunt) {

    //Load plugins
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-apidoc');

    //initialize plugin configs
    grunt.initConfig({
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'production'
            }
        },
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
            },
            server: {
                command: 'node bootstrap.js'
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
                    server: __dirname + '/test/functional/bootstrap.js',
                    port: 3500
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

        console.log("Setting up env ...");
        grunt.task.run('env:test');
    });

    grunt.registerTask('reset-db', ['exec:run-migrations-down', 'exec:run-migrations-up']);
    grunt.registerTask('unit-test', ['clean', 'init', 'mochaTest:unit-test']);
    grunt.registerTask('integration-test', ['clean', 'init', 'mochaTest:integration-test']);
    grunt.registerTask('functional-test', ['clean', 'init', 'express', 'mochaTest:functional-test', 'express-stop']);
    grunt.registerTask('test', ['clean', 'init', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop']);
    grunt.registerTask('ci', ['clean', 'init', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop']);

    grunt.registerTask('server', function() {
        var environment = grunt.option('env') || process.env.NODE_ENV || 'dev';
        grunt.task.run(['env:' + environment, 'exec:server']);
    });

    grunt.registerTask('default', ['clean', 'init', 'jshint', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop', 'apidoc']);
};