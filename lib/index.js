/*
 *
 */

"use strict";

var util = require('util')
  , cManager = require('./claims-manager');

/**
 * Module dependencies.
 */

module.exports = function(options) {

	var _self = { };  
		
	_self.JWTClaimsManager = cManager.JWTClaimsManager;
	_self.claimsManager = new _self.JWTClaimsManager(options);

	return _self;
};


