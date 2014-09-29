/*
 * sonic-cli
 * https://github.com/enytc/sonic-cli
 *
 * Copyright (c) 2014, EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

/*
 * Module Dependencies
 */

var request = require('superagent'),
    uploader = require('request'),
    inquirer = require('inquirer'),
    debug = require('./debugger.js'),
    _ = require('underscore'),
    h = require('./helpers.js'),
    fs = require('fs'),
    pj = require('prettyjson').render,
    join = require('path').join;

/*
 * Private Methods
 */

function response(err, res, pureJson, message, type) {
    if (err) {
        throw err;
    }
    if (res) {
        if (!pureJson) {
            console.log('\n[ ' + 'Response'.green.bold + ' ] ==> ');
            console.log();
            console.log(pj(res.body.response));
        } else {
            console.log(JSON.stringify(res.body.response, null, 4));
        }
    }
    if (message && type) {
        debug(message, type);
    }
    if (message && !type) {
        debug(message);
    }
}

/*
 * Public Methods
 */

/**
 * @class Sonic
 *
 * @constructor
 *
 * Constructor responsible for provide api requests
 *
 * @example
 *
 *     var api = new Sonic('url', access_token');
 *
 * @param {String} url Url of a Sonic CDN
 * @param {String} access_token Access Token
 */

var Sonic = module.exports = function Sonic(url, token) {
    //Access Token
    this.access_token = token;
    this.uri = url;
    //ApiUri
    var apiUri = url + '/api/:path';
    //Get handler
    this.get = function(path, cb) {
        request
            .get(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Post handler
    this.post = function(path, body, cb) {
        request
            .post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Put handler
    this.put = function(path, body, cb) {
        request
            .put(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //Delete handler
    this.delete = function(path, body, cb) {
        request
            .del(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token))
            .send(body)
            .set('Accept', 'application/json')
            .end(cb);
    };
    //File handler
    this.file = function(path, body, filePath, cb) {
        var r = uploader.post(apiUri.replace(new RegExp(':path', 'g'), path).replace(new RegExp(':token', 'g'), 'access_token=' + this.access_token), cb);
        var form = r.form();
        form.append('name', body.name);
        form.append('version', body.version);
        form.append('bucket', body.bucket);
        form.append('assetFile', fs.createReadStream(filePath));
    };
};

//HandlerExceptions
process.on('uncaughtException', function(err) {
    console.log();
    console.error(err.stack);
    console.log();
    console.error(err);
});

/**
 * Method responsible for asking questions
 *
 * @example
 *
 *     api.prompt(prompts, cb);
 *
 * @method prompt
 * @public
 * @param {Object} prompts Array of prompt options
 * @param {Function} cb A callback
 */

Sonic.prototype.prompt = function prompt(prompts, cb) {
    inquirer.prompt(prompts, function(answers) {
        cb(answers);
    });
};

/**
 * Method responsible for create connections
 *
 * @example
 *
 *     api.connect('url');
 *
 * @method connect
 * @public
 * @param {String} url Url of a Sonic CDN
 */

Sonic.prototype.connect = function connect(url) {
    h.write(join(__dirname, 'connections.json'), JSON.stringify({
        url: url
    }, null, 4));
    response(null, null, null, 'Initialized successfully!', 'success');
};

/**
 * Method responsible for login in accounts
 *
 * @example
 *
 *     api.login('username', 'password');
 *
 * @method login
 * @public
 * @param {String} accessToken Access Token
 * @param {String} username Username
 * @param {String} password Password
 */

Sonic.prototype.login = function login(accessToken, username, password) {
    //Credentials
    var loginObj;
    //Check method
    if (accessToken) {
        loginObj = {
            accessToken: accessToken
        };
    } else {
        loginObj = {
            username: username,
            password: password
        };
    }
    //Send request
    this.post('users/login', loginObj, function(err, res) {
        if (err) {
            response(err);
        }
        //Write config
        if (res.body.response.accessToken) {
            h.write(join(__dirname, 'sonicConfig.json'), JSON.stringify(res.body.response, null, 4));
            response(null, null, null, 'Logged successfully!', 'success');
        } else {
            response(null, null, null, 'Login failed. Try again!', 'error');
        }
    });
};

/**
 * Method responsible for show users
 *
 * @example
 *
 *     api.users(true);
 *
 * @method users
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Sonic.prototype.users = function users(pureJson) {
    this.get('users?:token', function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for generate a dinamic list of users
 *
 * @example
 *
 *     api.listUsers();
 *
 * @method listUsers
 * @public
 * @param {Function} callback A callback
 */

Sonic.prototype.listUsers = function listUsers(callback) {
    this.get('users?:token', function(err, res) {
        if (err) {
            return response(err);
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val) {
            list.push({
                name: val.username,
                value: val._id
            });
        });
        //Callback
        callback(list);
    });
};

/**
 * Method responsible for create accounts
 *
 * @example
 *
 *     api.createUser('username', 'password');
 *
 * @method createUser
 * @public
 * @param {String} username Username
 * @param {String} password Password
 */

Sonic.prototype.createUser = function createUser(username, password) {
    this.post('users?:token', {
        username: username,
        password: password
    }, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for update accounts
 *
 * @example
 *
 *     api.updateUser('username', 'password');
 *
 * @method updateUser
 * @public
 * @param {String} username Username
 * @param {String} password Password
 */

Sonic.prototype.updateUser = function updateUser(username, password) {
    this.put('users?:token', {
        username: username,
        password: password
    }, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for delete accounts
 *
 * @example
 *
 *     api.deleteUser('id');
 *
 * @method deleteUser
 * @public
 * @param {String} id ID of user
 */

Sonic.prototype.deleteUser = function deleteUser(id) {
    this.delete(join('users', id) + '?:token', null, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for show buckets
 *
 * @example
 *
 *     api.buckets(true);
 *
 * @method buckets
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Sonic.prototype.buckets = function buckets(pureJson) {
    this.get('buckets?:token', function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for generate a dinamic list of buckets
 *
 * @example
 *
 *     api.listBuckets();
 *
 * @method listBuckets
 * @public
 * @param {Function} callback A callback
 */

Sonic.prototype.listBuckets = function listBuckets(callback) {
    this.get('buckets?:token', function(err, res) {
        if (err) {
            return response(err);
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val) {
            list.push({
                name: val.name,
                value: val._id
            });
        });
        //Callback
        callback(list);
    });
};

/**
 * Method responsible for create buckets
 *
 * @example
 *
 *     api.createBucket('name');
 *
 * @method createBucket
 * @public
 * @param {String} name Name
 */

Sonic.prototype.createBucket = function createBucket(name) {
    this.post('buckets?:token', {
        name: name
    }, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for delete buckets
 *
 * @example
 *
 *     api.deleteBucket('id');
 *
 * @method deleteBucket
 * @public
 * @param {String} id ID of bucket
 */

Sonic.prototype.deleteBucket = function deleteBucket(id) {
    this.delete(join('buckets', id) + '?:token', null, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};

/**
 * Method responsible for show assets
 *
 * @example
 *
 *     api.assets(true);
 *
 * @method assets
 * @public
 * @param {Boolean} pureJson If true show json raw
 */

Sonic.prototype.assets = function assets(pureJson) {
    this.get('assets?:token', function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res, pureJson);
    });
};

/**
 * Method responsible for generate a dinamic list of assets
 *
 * @example
 *
 *     api.listAssets();
 *
 * @method listAssets
 * @public
 * @param {String} bucketId Id of a bucket
 * @param {String} name Asset name
 * @param {String} version Asset version
 * @param {Function} callback A callback
 */

Sonic.prototype.listAssets = function listAssets(bucketId, name, version, callback) {
    this.get(join('assets', bucketId, 'files') + '?name=' + name + '&version=' + version + '&:token', function(err, res) {
        if (err) {
            return response(err);
        }
        var list = [];
        //Start
        _.each(res.body.response, function(val) {
            list.push({
                name: val.fileName,
                value: val._id
            });
        });
        //Callback
        callback(list);
    });
};

/**
 * Method responsible for generate a dinamic list of versions
 *
 * @example
 *
 *     api.listVersions(id, name, fn);
 *
 * @method listVersions
 * @public
 * @param {String} bucketId Id of a bucket
 * @param {String} name Asset name
 * @param {Function} callback A callback
 */

Sonic.prototype.listVersions = function listVersions(id, name, callback) {
    this.get(join('buckets', id, 'versions') + '?name=' + name + '&:token', function(err, res) {
        if (err) {
            return response(err);
        }
        //Callback
        callback(res.body.response);
    });
};

/**
 * Method responsible for generate a dinamic list of assets by bucket
 *
 * @example
 *
 *     api.listAssetsByBucket(bucketId, fn);
 *
 * @method listAssetsByBucket
 * @public
 * @param {String} bucketId Id of a bucket
 * @param {Function} callback A callback
 */

Sonic.prototype.listAssetsByBucket = function listAssetsByBucket(bucketId, callback) {
    this.get(join('buckets', bucketId) + '?:token', function(err, res) {
        if (err) {
            return response(err);
        }
        //Callback
        callback(res.body.response);
    });
};

/**
 * Method responsible for create assets
 *
 * @example
 *
 *     api.createAsset('name');
 *
 * @method createAsset
 * @public
 * @param {String} name Name of asset
 * @param {String} version Name
 * @param {String} bucketId Id of a bucket
 * @param {String} filePath File path
 */

Sonic.prototype.createAsset = function createAsset(name, version, bucketId, filePath) {
    //Asset Path
    var assetPath;
    //Resolve path
    if (/^\/+/.test(filePath)) {
        assetPath = filePath;
    } else {
        assetPath = join(process.cwd(), filePath);
    }
    //Send request
    this.file('assets/upload?:token', {
        name: name,
        version: version,
        bucket: bucketId
    }, assetPath, function(err, http, res) {
        if (err) {
            response(err);
        }
        response(null, {
            body: JSON.parse(res)
        });
    });
};

/**
 * Method responsible for delete assets
 *
 * @example
 *
 *     api.deleteAsset('id');
 *
 * @method deleteAsset
 * @public
 * @param {String} bucketId Id of bucket
 * @param {String} id Id of asset
 * @param {String} option Delete option
 */

Sonic.prototype.deleteAsset = function deleteAsset(bucketId, id, option, name) {
    this.delete(join('assets', bucketId, id) + '?name=' + name + '&opt=' + option + '&:token', null, function(err, res) {
        if (err) {
            response(err);
        }
        response(null, res);
    });
};
