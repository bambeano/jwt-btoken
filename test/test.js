
var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , rootPath = process.cwd();

var options = {
	expiryInSeconds: 60 * 60,
  	skewInSeconds: 60 * 3,
 	algorithm: 'RS512',
  	issuer: 'localhost',
  	cert: fs.readFileSync(path.join(rootPath, 'test/cert.pem')),
	key: fs.readFileSync(path.join(rootPath, 'test/key.pem'))
};

var jwtBtoken = require('../index')(options);

var token = jwtBtoken.claimsManager.createToken({ userId: 'my_username' });
util.log('Token: ' + token);

var claims = jwtBtoken.claimsManager.extractClaims(token);
util.log('Claims:\r\n===========================\r\n' + util.inspect(claims));


util.log('test ended...');
