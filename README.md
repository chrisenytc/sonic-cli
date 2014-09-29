# ![Sonic CLI](https://raw.githubusercontent.com/enytc/sonic/master/logo.png)

> A CLI tool for manage Sonic (CDN)

[![Build Status](https://secure.travis-ci.org/enytc/sonic-cli.png?branch=master)](https://travis-ci.org/enytc/sonic-cli) [![NPM version](https://badge-me.herokuapp.com/api/npm/sonic-cli.png)](http://badges.enytc.com/for/npm/sonic-cli)

## Getting Started
Install the module with: 

```bash
$ npm install -g sonic-cli
```

Example:

```javascript
var Sonic = require('sonic-cli');
//Create new instance of Sonic CLI
var api = new Sonic('http://localhost:8081', 'access_token');
```

## How to use

Example of use the Sonic CLI

```bash
$ sonic connect
```

## Documentation


#### .connect(url)

**Parameter**: `url`
**Type**: `String`
**Example**: `http://localhost:8081`


The 'connect' method is responsible for create connections

How to use this method

```javascript

api.connect('http://localhost:8081');
```

#### .login(accessToken, username, password)

**Parameter**: `accessToken`
**Type**: `String`
**Example**: `157953`

**Parameter**: `username`
**Type**: `String`
**Example**: `chrisenytc`

**Parameter**: `password`
**Type**: `String`
**Example**: `12345678`


The 'login' method is responsible for login in accounts

How to use this method

```javascript

//Login with access token
api.login('12345678');

//Login with username and password
api.login(null, 'chrisenytc', '12345678');
```

#### .users(pureJson)

**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'users' method is responsible for show users

How to use this method

```javascript

api.users(true);
```

#### .createUser(username, password)

**Parameter**: `username`
**Type**: `String`
**Example**: `chrisenytc`

**Parameter**: `password`
**Type**: `String`
**Example**: `12345678`


The 'createUser' method is responsible for create new users

How to use this method

```javascript

api.createUser('chrisenytc', '12345678');
```

#### .updateUser(username, password)

**Parameter**: `username`
**Type**: `String`
**Example**: `chrisenytc`

**Parameter**: `password`
**Type**: `String`
**Example**: `12345678`


The 'updateUser' method is responsible for update users

How to use this method

```javascript

api.updateUser('chrisenytc', '12345678');
```

#### .deleteUser(id)

**Parameter**: `id`
**Type**: `String`
**Example**: `id`


The 'deleteUser' method is responsible for delete users

How to use this method

```javascript

api.deleteUser('id');
```

#### .buckets(pureJson)

**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'buckets' method is responsible for show all buckets

How to use this method

```javascript

api.buckets(true);
```

#### .createBucket(name)

**Parameter**: `name`
**Type**: `String`
**Example**: `bella`


The 'createBucket' method is responsible for create buckets

How to use this method

```javascript

api.createBucket('bella');
```

#### .deleteBucket(id)

**Parameter**: `id`
**Type**: `String`
**Example**: `id`


The 'deleteBucket' method is responsible for delete buckets

How to use this method

```javascript

api.deleteBucket('id');
```

#### .assets(pureJson)

**Parameter**: `pureJson`
**Type**: `Boolean`
**Example**: `true`


The 'assets' method is responsible for show all assets

How to use this method

```javascript

api.assets(true);
```

#### .createAsset(name, version, bucketId, filePath)

**Parameter**: `name`
**Type**: `String`
**Example**: `bella`

**Parameter**: `version`
**Type**: `String`
**Example**: `0.1.0`

**Parameter**: `bucketId`
**Type**: `String`
**Example**: `id`

**Parameter**: `filePath`
**Type**: `String`
**Example**: `/home/chrisenytc/Labs/Node/sonic-cli/lib/sonic-cli.js`


The 'createAsset' method is responsible for create assets

How to use this method

```javascript

api.createAsset('bella', '0.1.0', 'id', '/home/chrisenytc/Labs/Node/sonic-cli/lib/sonic-cli.js');
```

#### .deleteAsset(bucketId, id, option, [name,])

**Parameter**: `bucketId`
**Type**: `String`
**Example**: `id`

**Parameter**: `id`
**Type**: `String`
**Example**: `id`

**Parameter**: `option`
**Type**: `String`
**Options**: `asset, version or file`
**Example**: `asset`

**Parameter**: `name`
**Type**: `String`
**Example**: `belle`


The 'deleteAsset' method is responsible for delete assets

How to use this method

```javascript

//Delete asset
api.deleteAsset('bucketId', 'belle', 'asset');

//Delete version
api.deleteAsset('bucketId', '0.1.0', 'version', 'belle');

//Delete file
api.deleteAsset('bucketId', 'id', 'file');
```


## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/enytc/sonic-cli/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/enytc/sonic-cli/issues).

## License 

The BSD License

Copyright (c) 2014, EnyTC Corporation

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the EnyTC Corporation nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
