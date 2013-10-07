'use strict';

/*
 * This file is required by the mocha-test grunt task.  This should contain
 * things that need to be done for every test file
 */

var chai = require('chai');

// should must be defined globally to make the linter happy
global.should = chai.should();

// include stack track on test failure
chai.Assertion.includeStack = false;

// needed for blanket instrumentation with mocha
// require('blanket')({
//     'data-cover-only': ['cli-wrapper.js', 'process.js'],
//     'data-cover-never': ['node_modules', 'test']
// });


// ---------------------

// require('blanket')({
//     'data-cover-only': [ 'src/' ],
//     'data-cover-never': ['node_modules', 'test']
// });
// require('blanket')({
    // Only files that match the pattern will be instrumented
//     pattern: '/src/'
// });
