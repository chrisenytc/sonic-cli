#!/usr/bin/env node

/*
 * sonic-cli
 * https://github.com/enytc/sonic-cli
 *
 * Copyright (c) 2014, EnyTC Corporation
 * Licensed under the BSD license.
 */

/**
 * Module dependencies.
 */

var program = require('commander'),
    updateNotifier = require('update-notifier'),
    _ = require('underscore'),
    banner = require('../lib/banner.js'),
    Sonic = require('..'),
    api,
    logged,
    disconnected,
    path = require('path'),
    debug = require('../lib/debugger.js'),
    pkg = require('../package.json'),
    h = require('../lib/helpers.js'),
    connPath = path.join(__dirname, '..', 'lib', 'connections.json'),
    configPath = path.join(__dirname, '..', 'lib', 'sonicConfig.json');

require('colors');

/*
 * Sonic Bootstrap
 */

program
    .version(pkg.version, '-v, --version')
    .usage('command [option]'.white);

/*
 * Start API
 */

if (h.exists(connPath)) {
    var connections = require(connPath);
    if (h.exists(configPath)) {
        var config = require(configPath);
        api = new Sonic(connections.url, config.accessToken);
        logged = true;
    } else {
        api = new Sonic(connections.url);
        debug('  You are not logged in at the time. You may not use all the features of Sonic if you do not login with your account.\n', 'error');
    }
} else {
    api = new Sonic();
    disconnected = true;
    debug('  You need to connect to a Sonic CDN to be able to start using!', 'error');
    debug('  Try: sonic connect\n');
}

/*
 * Options
 */

program
    .option('--json', 'Show pure JSON output');

/*
 * Sonic Connect
 */

program
    .command('connect')
    .description('Create a connection to your Sonic CDN'.white)
    .action(function() {
        var prompts = [{
            type: 'input',
            name: 'url',
            message: 'Enter a url of your Sonic CDN'
        }];
        //Ask
        api.prompt(prompts, function(answers) {
            api.connect(answers.url);
        });
    });

if (!disconnected) {

    /*
     * Sonic Login
     */

    program
        .command('login')
        .description('Login in your Sonic account'.white)
        .action(function() {
            var prompts = [{
                type: 'list',
                name: 'method',
                message: 'Which method you want to use to log into your Sonic CDN?',
                choices: [{
                    name: 'Username and Password',
                    value: 'basic'
                }, {
                    name: 'Access Token',
                    value: 'auth'
                }]
            }];
            var promptsOp1 = [{
                type: 'input',
                name: 'username',
                message: 'Enter your username'
            }, {
                type: 'password',
                name: 'password',
                message: 'Enter your password'
            }];
            var promptsOp2 = [{
                type: 'input',
                name: 'accessToken',
                message: 'Enter your access token'
            }];
            //Ask
            api.prompt(prompts, function(answers) {
                if (answers.method === 'basic') {
                    api.prompt(promptsOp1, function(answersOp1) {
                        api.login(null, answersOp1.username, answersOp1.password);
                    });
                } else {
                    api.prompt(promptsOp2, function(answersOp2) {
                        api.login(answersOp2.accessToken);
                    });
                }
            });
        });
}


if (logged) {

    /*
     * Sonic Logout
     */

    program
        .command('logout')
        .description('Logout of your Sonic account'.white)
        .action(function() {
            var prompts = [{
                type: 'confirm',
                name: 'logout',
                message: 'Are you sure you want to logout from your account?'
            }];
            //Ask
            api.prompt(prompts, function(answers) {
                if (answers.logout) {
                    if (h.exists(configPath)) {
                        h.remove(configPath);
                    }
                    debug('You went out of your account successfully!', 'success');
                }
            });
        });


    /*
     * Sonic Users
     */

    program
        .command('users')
        .description('Show users'.white)
        .action(function() {
            if (program.json) {
                api.users(true);
            } else {
                api.users();
            }
        });


    /*
     * Sonic Create User
     */

    program
        .command('users:create')
        .description('Create a new user'.white)
        .action(function() {
            var prompts = [{
                type: 'input',
                name: 'username',
                message: 'Enter your username'
            }, {
                type: 'password',
                name: 'password',
                message: 'Enter your password'
            }];
            //Ask
            api.prompt(prompts, function(answers) {
                api.createUser(answers.username, answers.password);
            });
        });


    /*
     * Sonic Update User
     */

    program
        .command('users:update')
        .description('Update your account'.white)
        .action(function() {
            var prompts = [{
                type: 'input',
                name: 'username',
                message: 'Enter a new username, Leave blank for no change'
            }, {
                type: 'password',
                name: 'password',
                message: 'Enter a new password, Leave blank for no change'
            }];
            //Ask
            api.prompt(prompts, function(answers) {
                api.updateUser(answers.username, answers.password);
            });
        });


    /*
     * Sonic Delete User
     */

    program
        .command('users:delete')
        .description('Delete a user'.white)
        .action(function() {
            api.listUsers(function(list) {
                if (list.length < 1) {
                    console.log('  No have users.'.red.bold + '\n\n  Create a new user.\n\n  $ sonic users:create'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: 'list',
                    message: 'Choose a user',
                    name: 'user',
                    choices: list
                }, {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you sure you want to delete this user?'
                }];
                //Ask
                api.prompt(prompts, function(answers) {
                    if (answers.confirm) {
                        api.deleteUser(answers.user);
                    }
                });
            });
        });


    /*
     * Sonic Buckets
     */

    program
        .command('buckets')
        .description('Show all buckets'.white)
        .action(function() {
            if (program.json) {
                api.buckets(true);
            } else {
                api.buckets();
            }
        });


    /*
     * Sonic Create Bucket
     */

    program
        .command('buckets:create')
        .description('Create a new bucket'.white)
        .action(function() {
            var prompts = [{
                type: 'input',
                name: 'name',
                message: 'Enter a name of bucket'
            }];
            //Ask
            api.prompt(prompts, function(answers) {
                api.createBucket(answers.name);
            });
        });

    /*
     * Sonic Delete Bucket
     */

    program
        .command('buckets:delete')
        .description('Delete a bucket'.white)
        .action(function() {
            api.listBuckets(function(list) {
                if (list.length < 1) {
                    console.log('  You don\'t have buckets.'.red.bold + '\n\n  Create a new bucket. \n\n  $ sonic buckets:create'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: 'list',
                    message: 'Choose a bucket',
                    name: 'bucket',
                    choices: list
                }, {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you sure you want to delete this bucket?'
                }];
                //Ask
                api.prompt(prompts, function(answers) {
                    if (answers.confirm) {
                        api.deleteBucket(answers.bucket);
                    }
                });
            });
        });


    /*
     * Sonic Assets
     */

    program
        .command('assets')
        .description('Show all assets'.white)
        .action(function() {
            if (program.json) {
                api.assets(true);
            } else {
                api.assets();
            }
        });


    /*
     * Sonic Create Asset
     */

    program
        .command('assets:upload <file>')
        .description('Upload a new asset'.white)
        .action(function(file) {
            api.listBuckets(function(list) {
                if (list.length < 1) {
                    console.log('  You don\'t have buckets.'.red.bold + '\n\n  Create a new bucket. \n\n  $ sonic buckets:create'.bold.white);
                    process.exit();
                }
                var prompts = [{
                    type: 'list',
                    message: 'Choose a bucket',
                    name: 'bucket',
                    choices: list
                }, {
                    type: 'input',
                    name: 'name',
                    message: 'Enter a name of this asset'
                }, {
                    type: 'input',
                    name: 'version',
                    message: 'Enter a version of this asset',
                    default: '0.1.0'
                }, {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you sure you want to upload this asset?'
                }];
                //Ask
                api.prompt(prompts, function(answers) {
                    if (answers.confirm) {
                        api.createAsset(answers.name, answers.version, answers.bucket, file);
                    }
                });
            });
        });

    /*
     * Sonic Delete Asset
     */

    program
        .command('assets:delete')
        .description('Delete a asset'.white)
        .action(function(file) {
            var promptsOpt = [{
                type: 'list',
                message: 'Choose an action',
                name: 'action',
                choices: [{
                    name: 'Delete asset',
                    value: 'asset'
                }, {
                    name: 'Delete version',
                    value: 'version'
                }, {
                    name: 'Delete file',
                    value: 'file'
                }]
            }];
            api.prompt(promptsOpt, function(answersOpt) {
                switch (answersOpt.action) {
                    case 'asset':
                        api.listBuckets(function(list) {
                            if (list.length < 1) {
                                console.log('  You don\'t have buckets.'.red.bold + '\n\n  Create a new bucket. \n\n  $ sonic buckets:create'.bold.white);
                                process.exit();
                            }
                            var prompts = [{
                                type: 'list',
                                message: 'Choose a bucket',
                                name: 'bucket',
                                choices: list
                            }];
                            //Ask
                            api.prompt(prompts, function(answersBucket) {
                                api.listAssetsByBucket(answersBucket.bucket, function(list) {
                                    if (list.length < 1) {
                                        console.log('  You don\'t have assets.'.red.bold + '\n\n  Create a new asset. \n\n  $ sonic assets:upload <file>'.bold.white);
                                        process.exit();
                                    }
                                    var prompts = [{
                                        type: 'list',
                                        message: 'Choose a asset',
                                        name: 'asset',
                                        choices: list
                                    }, {
                                        type: 'confirm',
                                        name: 'confirm',
                                        message: 'Are you sure you want to delete this asset?'
                                    }];
                                    //Ask
                                    api.prompt(prompts, function(answers) {
                                        if (answers.confirm) {
                                            api.deleteAsset(answersBucket.bucket, answers.asset, answersOpt.action);
                                        }
                                    });
                                });
                            });
                        });
                        break;

                    case 'version':

                        break;

                    case 'file':

                        break;
                }
            });

        });




}


/*
 * Sonic on help ption show examples
 */

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ sonic connect');
    console.log('    $ sonic login');
    console.log('');
});

/*
 * Sonic Banner
 */

if (process.argv.length === 3 && process.argv[2] === '--help') {
    banner();
}

if (process.argv.length === 4 && process.argv[3] !== '--json') {
    banner();
} else {
    if (process.argv.length === 3 && process.argv[2] !== '--help') {
        banner();
    }
}

/*
 * Sonic Process Parser
 */

program.parse(process.argv);

/*
 * Sonic Default Action
 */

var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
});

if (notifier.update) {
    notifier.notify(true);
}

if (process.argv.length == 2) {
    banner();
    program.help();
}
