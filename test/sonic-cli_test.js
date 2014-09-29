/*
 * sonic-cli
 * https://github.com/enytc/sonic-cli
 *
 * Copyright (c) 2014, EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var Sonic = require('../lib/sonic-cli.js');
var api = new Sonic('access_token');

describe('sonic-cli module', function() {
    describe('#constructor()', function() {
        it('should be a function', function() {
            Sonic.should.be.a("function");
        });
    });
    describe('#instance()', function() {
        it('should be a object', function() {
            api.should.be.a("object");
        });
    });
});

