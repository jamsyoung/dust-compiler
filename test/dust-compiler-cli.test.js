/* global describe, it */
'use strict';

var fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process'),
    cliWrapperPath = path.join(path.dirname(fs.realpathSync(__filename)), '../../dust-compiler-cli.js'),
    // expectedOutput = '',
    packageMetadata = require('../../package.json');

describe.skip('dust-compiler-cli', function () {
    it('should return the current version when called with -v', function (done) {
        childProcess.exec(cliWrapperPath + ' -v', function (error, stdout) {
            if (error) { console.dir(error); }

            stdout.should.equal('dust-compiler v' + packageMetadata.version + '\n');
            done();
        });
    });
});
