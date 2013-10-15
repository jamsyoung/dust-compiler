/* global describe, it */
'use strict';

var fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process'),
    cliWrapperPath = path.join(path.dirname(fs.realpathSync(__filename)), '../../dust-compiler-cli.js'),
    expectedOutput = 'Usage: dust-compiler -s|--source source_path -d|--destination destination_path [--bootstrap] [--nonotify] [--includepath]\n\nOptions:\n  --source, -s       The source .dust templates to watch.                           \n  --destination, -d  The destination destination to write compiles .js files out to.\n  --bootstrap        Compiles all files on start.                                   \n  --nonotify         Do not notify.                                                 \n  --includepath      Include the path in the name of the compiled dust template.    \n  --amd              Wrap the output AMD style                                      \n  --version, -v      Show the current version installed of dust-compiler            \n  --help, -h         You are looking at it                                          \n\n',
    packageMetadata = require('../../package.json');

describe('dust-compiler-cli', function () {
    it('should return the current version when called with -v', function (done) {
        childProcess.exec(cliWrapperPath + ' -v', function (error, stdout) {
            if (error) { console.dir(error); }

            stdout.should.equal('dust-compiler v' + packageMetadata.version + '\n');
            done();
        });
    });

    it('should return the current version when called with --version', function (done) {
        childProcess.exec(cliWrapperPath + ' --version', function (error, stdout) {
            if (error) { console.dir(error); }

            stdout.should.equal('dust-compiler v' + packageMetadata.version + '\n');
            done();
        });
    });

    it('should return help when called with -h', function (done) {
        childProcess.exec(cliWrapperPath + ' -h', function (error, stdout) {
            if (error) { console.dir(error); }

            stdout.should.equal(expectedOutput);
            done();
        });
    });

    it('should return help when called with --help', function (done) {
        childProcess.exec(cliWrapperPath + ' --help', function (error, stdout) {
            if (error) { console.dir(error); }

            stdout.should.equal(expectedOutput);
            done();
        });
    });
});
