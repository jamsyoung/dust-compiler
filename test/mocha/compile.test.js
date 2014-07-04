/* jshint expr: true, mocha: true */
/* global expect */
'use strict';

var
    childProcess = require('child_process'),
    compile = require('../../lib/compile.js'),
    fs = require('fs');


describe('compile', function () {
    it('should compile a template with only a source path and filename provided', function (done) {
        // techincally it should work with only a filename, but I don't want mock data mixed with
        // the mocha tests.  The default path when no path is provided is '.'
        compile('test.dust', 'test/mock/');

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.contain('dust.register("test"');
                done();
            });
        }, 1000 * 0.5);
    });

    it('should compile a template with a source path, filename, and destination path provided', function (done) {
        compile('test.dust', 'test/mock/', 'test/mock/');

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.contain('dust.register("test"');
                done();
            });
        }, 1000 * 0.5);
    });

    it('should compile a template and default to NOT include the path in the registered name if options.includepath is not set', function (done) {
        compile('test.dust', 'test/mock/', 'test/mock/');

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.contain('dust.register("test"');
                done();
            });
        }, 1000 * 0.5);
    });

    it('should include the path as the registered dust template name if options.includepath is set', function (done) {
        compile('test.dust', 'test/mock/', 'test/mock/', { includepath: true });

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.contain('dust.register("test/mock/test"');
                done();
            });
        }, 1000 * 0.5);
    });

    it('should support AMD syntax if the --amd flag is used', function (done) {
        compile('test.dust', 'test/mock/', 'test/mock/', { amd: true });

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.contain('define(["dust"], function () { dust = require("dust");');
                data.should.match(/^define/);
                data.should.match(/\}\);$/);
                done();
            });
        }, 1000 * 0.5);
    });

    it('should not use log-notify if options.nonotify is set', function () {
        // this test is satisified by the code coverage showing the conditional is tested
        // there is no way to use a 'should', 'expect', or 'assert' to check if the os specific
        // notification was not used.
        compile('test.dust', 'test/mock/', 'test/mock/', { nonotify: true });
    });

    it('should match the exact same output from dustc with includepath', function (done) {
        childProcess.exec('node_modules/.bin/dustc --name=test/mock/test test/mock/test.dust', function (error, stdout) {
            expect(error).to.be['null'];
            compile('test.dust', 'test/mock/', 'test/mock/', { includepath: true });

            // wait 0.5 seconds before reading the file
            setTimeout(function () {
                fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                    if (error) { console.log(error); }

                    expect(error).to.be['null'];
                    expect(data).to.be.a('string');
                    expect(data).to.equal(stdout);
                    done();
                });
            }, 1000 * 0.5);
        });
    });

    it('should match the exact same output from dustc with no path', function (done) {
        childProcess.exec('node_modules/.bin/dustc --name=test test/mock/test.dust', function (error, stdout) {
            expect(error).to.be['null'];
            compile('test.dust', 'test/mock/', 'test/mock/');

            // wait 0.5 seconds before reading the file
            setTimeout(function () {
                fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                    if (error) { console.log(error); }

                    expect(error).to.be['null'];
                    expect(data).to.be.a('string');
                    expect(data).to.equal(stdout);
                    done();
                });
            }, 1000 * 0.5);
        });
    });
});
