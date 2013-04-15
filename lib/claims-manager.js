
var util = require('util')
  , os = require('os')
  , jwt = require('green-jwt');

/*
 *          Reserved Claim Names . . . . . . . . . . . . . . . . . . .  7
 *      4.1.1.  "iss" (Issuer) Claim . . . . . . . . . . . . . . . . .  8
 *      4.1.2.  "sub" (Subject) Claim  . . . . . . . . . . . . . . . .  8
 *      4.1.3.  "aud" (Audience) Claim . . . . . . . . . . . . . . . .  8
 *      4.1.4.  "exp" (Expiration Time) Claim  . . . . . . . . . . . .  8
 *      4.1.5.  "nbf" (Not Before) Claim . . . . . . . . . . . . . . .  8
 *      4.1.6.  "iat" (Issued At) Claim  . . . . . . . . . . . . . . .  9
 *      4.1.7.  "jti" (JWT ID) Claim . . . . . . . . . . . . . . . . .  9
 *      4.1.8.  "typ" (Type) Claim . . 
 */
var RESERVED_CLAIMS = ['exp', 'nbf', 'iat', 'iss', 'aud', 'typ', 'sub', 'jti']
  , DEFAULT_EXPIRY_SECONDS = (60 * 60 * 24) 	// 24 hours
  , DEFAULT_SKEW_SECONDS = (60 * 3)				// 3 minutes
  , CLAIMS_VERSION = '0.1.0';

/*
 * isNumeric
 */
var isNumeric = function isNumeric (num) {
	return (!isNaN(parseFloat(num)) && isFinite(num));
};

/*
 * JWTClaimsManager
 */
var JWTClaimsManager = module.exports.JWTClaimsManager = function JWTClaimsManager (options) {

    var _self = this 
      , _options = typeof options === undefined ? { } : options;

  	_options.expiryInSeconds = isNumeric(_options.expiryInSeconds) ? _options.expiryInSeconds : DEFAULT_EXPIRY_SECONDS;
  	_options.skewInSeconds = isNumeric(_options.skewInSeconds) ? _options.skewInSeconds : DEFAULT_SKEW_SECONDS;
  	_options.algorithm = _options.algorithm || 'RS512';
  	_options.issuer = _options.issuer || os.hostname();

  	Object.defineProperty(_self, 'options', {
  		enummerable: true,
  		get: function () { return _options; }
  	});  // end options

  	_self.createToken = function (claims) {
  		_self.setTimeClaims(claims);		// set time claims

  		claims['iss'] = _options.issuer; 	// set issuer claim
  		claims['ver'] = CLAIMS_VERSION

		if (_options.key === undefined || _options.key === null) {
			throw new Error('[JWT] X.509 private key is required for signing claims (defined in "key" opitons property).');
		}

		return jwt.encode(claims, _options.key, _options.algorithm);
  	}; // end createToken

  	_self.extractClaims = function (token) {
		var decoded = jwt.decode(token);

	 	if (_options.cert === undefined || _options.cert === null) {
			throw new Error('[JWT] X.509 public certificate is required for validating signatures (defined in "cert" options property).');
		}

		if (!decoded.verify(_options.cert)) {
			throw new Error('[JWT] signature validation failed.');
		}

		if (!_self.validateTimeClaims(decoded.claim, null)) {
			throw new Error('[JWT] time claims validation failed.');
		}

		return decoded.claim;
  	}; // end extractClaims

	_self.getSecondsAfterEpoch = function (datetime) {
		if (datetime instanceof Date) {
			// already date object
		} else if (isNumeric(datetime)) {
			datetime = new Date(datetime);
		} else {
			datetime = new Date();
		}
		// ~~ -> (double NOT bitwise operator) A.K.A. faster substitute for Math.floor()
		return ~~(datetime.getTime() / 1000);
	}; // end getSecondsAfterEpoch

	_self.setTimeClaims = function (claims, datetime) {
		claims = claims || { };
		var secondsAfterEpoch = _self.getSecondsAfterEpoch(datetime);
		claims['iat'] = secondsAfterEpoch;  							// issued at
		claims['nbf'] = (secondsAfterEpoch - _options.skewInSeconds);	// not before
		claims['exp'] = (secondsAfterEpoch + _options.expiryInSeconds);	// expiration
		return claims;
	}; // end setTimeClaims

	_self.getAgeInSeconds = function (claims) {
		if (claims['iat']) {
			return (_self.getSecondsAfterEpoch(null) - claims['iat']);
		} else {
			return null;
		}
	}; // end getAgeInSeconds

	_self.validateTimeClaims = function (claims, datetime) {
		var secondsAfterEpoch = _self.getSecondsAfterEpoch(datetime);
		if (claims['exp']) {
			if (claims['exp'] < (secondsAfterEpoch - _options.skewInSeconds)) {
				throw new Error('[JWT] token is expired, based upon the [exp] header.');
			}
		}
		if (claims['nbf']) {
			if (claims['nbf'] > (secondsAfterEpoch + _options.skewInSeconds)) {
				throw new Error('[JWT] token is not yet valid, based upon the [nbf] header.');
			}
		}
		return true;
	}; // end validateTimeClaims

	return _self;

}; // end JWTClaimsManager
 







