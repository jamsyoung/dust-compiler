/* global describe, it */
'use strict';

var log = require('../../lib/log');

describe('lib/log', function () {
    it('should should return a function', function () {
        log.should.be.a('function');
    });
});
