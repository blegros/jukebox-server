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
            options: {
                NODE_MONGOOSE_MIGRATIONS_CONFIG: './migrations/config.json'
            },
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
                command: 'mongoose-migrate up'
            },
            'run-migrations-down': {
                command: 'mongoose-migrate down'
            },
            server: {
                command: 'node ./bootstrap.js'
            },
            heroku: {
                command: 'git push heroku master'
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
    });

    var findEnvironmentTarget = function() {
        return 'env:' + (grunt.option('env') || 'dev');
    };

    grunt.registerTask('reset-db', [findEnvironmentTarget(), 'exec:run-migrations-down', 'exec:run-migrations-up']);
    grunt.registerTask('clear-db', [findEnvironmentTarget(), 'exec:run-migrations-down']);
    grunt.registerTask('migrate-db', [findEnvironmentTarget(), 'exec:run-migrations-up']);

    grunt.registerTask('unit-test', ['init', 'env:test', 'mochaTest:unit-test']);
    grunt.registerTask('integration-test', ['init', 'env:test', 'mochaTest:integration-test']);
    grunt.registerTask('functional-test', ['init', 'env:test', 'express', 'mochaTest:functional-test', 'express-stop']);
    grunt.registerTask('test', ['clean', 'init', 'env:test', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop']);

    grunt.registerTask('ci', ['clean', 'init', 'env:test', 'mochaTest:unit-test', 'reset-db', 'mochaTest:integration-test', 'express', 'mochaTest:functional-test', 'express-stop']);

    grunt.registerTask('server', [findEnvironmentTarget(), 'exec:server']);

    grunt.registerTask('deploy', ['exec:heroku']);

    grunt.registerTask('default', ['ci', 'jshint', 'apidoc']);
};