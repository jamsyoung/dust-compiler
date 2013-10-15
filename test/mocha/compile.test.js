/* global describe, it */
'use strict';

var fs = require('fs'),
    compile = require('../../lib/compile.js');


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
        }, 500);
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
        }, 500);
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
        }, 500);
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
        }, 500);
    });

    it('should support AMD syntax if the --amd flag is used', function (done) {
        compile('test.dust', 'test/mock/', 'test/mock/', { amd: true });

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.contain('define(["dust"], function() { dust = require("dust");');
                data.should.match(/^define/);
                data.should.match(/\}\);$/);
                done();
            });
        }, 500);
    });

    it('should not use log-notify if options.nonotify is set', function () {
        // this test is satisified by the code coverage showing the conditional is tested
        // there is no way to use a 'should', 'expect', or 'assert' to check if the os specific
        // notification was not used.
        compile('test.dust', 'test/mock/', 'test/mock/', { nonotify: true });
    });

    it('should match the exact same output from dustc with includepath', function (done) {
        var controlData = '(function(){dust.register("test/mock/test",body_0);function body_0(chk,ctx){return chk.exists(ctx.get("foo"),ctx,{"block":body_1},null).notexists(ctx.get("foo"),ctx,{"block":body_2},null);}function body_1(chk,ctx){return chk.reference(ctx.getPath(false,["foo","bar"]),ctx,"h").write(" ").reference(ctx.getPath(false,["foo","baz"]),ctx,"h");}function body_2(chk,ctx){return chk.write("Goodbye cruel world");}return body_0;})();';
        compile('test.dust', 'test/mock/', 'test/mock/', { includepath: true });

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.equal(controlData);
                done();
            });
        }, 500);
    });

    it('should match the exact same output from dustc with no path', function (done) {
        var controlData = '(function(){dust.register("test",body_0);function body_0(chk,ctx){return chk.exists(ctx.get("foo"),ctx,{"block":body_1},null).notexists(ctx.get("foo"),ctx,{"block":body_2},null);}function body_1(chk,ctx){return chk.reference(ctx.getPath(false,["foo","bar"]),ctx,"h").write(" ").reference(ctx.getPath(false,["foo","baz"]),ctx,"h");}function body_2(chk,ctx){return chk.write("Goodbye cruel world");}return body_0;})();';
        compile('test.dust', 'test/mock/', 'test/mock/');

        // wait 0.5 seconds before reading the file
        setTimeout(function () {
            fs.readFile('test/mock/test.js', 'utf-8', function (error, data) {
                if (error) { console.log(error); }

                data.should.be.a('string');
                data.should.equal(controlData);
                done();
            });
        }, 500);
    });
});
