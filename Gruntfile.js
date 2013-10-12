'use strict';

var path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: [
                '*.js',
                'lib/*.js',
                'test/*.js',
                'test/mocha/*.js'
            ],
            options: {
                ignores: [],
                jshintrc: path.normalize('.jshintrc')
            }
        },
        complexity: {
            build: {
                src: [
                    'Gruntfile.js',
                    'test/**/*.js'
                ],
                options: {
                    errorsOnly: false,
                    cyclomatic: 2,
                    halstead: 5,
                    maintainability: 84
                }
            },
            source: {
                src: ['lib/*.js'],
                options: {
                    errorsOnly: false,
                    cyclomatic: 4,
                    halstead: 12,
                    maintainability: 100
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'test/mocha-setup'
                },
                src: ['test/mocha/*.js']
            }
        },
        clean: {
            files: [
                'man/man1/*',
                'node_modules'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['jshint', 'complexity', 'mochaTest']);

    grunt.registerTask('default', ['test']);
};
