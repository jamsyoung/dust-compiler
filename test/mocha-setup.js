'use strict';

/*
 * This file is required by the mocha-test grunt task.  This should contain
 * things that need to be done for every test file
 */

var chai = require('chai');

// should must be defined globally to make the linter happy
global.should = chai.should();
global.expect = chai.expect;

// include stack track on test failure
chai.Assertion.includeStack = false;

require('blanket')({
    'data-cover-only': ['dust-compiler-cli.js', 'compile.js', 'dust-compiler.js'],
    'data-cover-never': ['node_modules', 'test']
});
