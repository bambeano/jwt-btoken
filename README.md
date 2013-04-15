# jwt-btoken

A very basic [JWT](http://tools.ietf.org/html/draft-jones-json-web-token-10) Bearer token for use with __oAuth__. This version relies on [green-jwt](https://github.com/berngp/node-green-jwt) 
and as such only implements [JWS](http://tools.ietf.org/html/draft-ietf-jose-json-web-signature-02).

## Install

```bash
$ npm install jwt-btoken
```

## Usage

```js
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
```

## Contributing

Patches are welcome, fork away! :-)

## License 

(The MIT License)

Copyright (c) 2012 Dean Kern &lt;dean@thekerns.org&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


