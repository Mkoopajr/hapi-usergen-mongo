var vows = require('vows'),
    assert = require('assert');

if (!process.env.LOCAL_USER || !process.env.LOCAL_PWD || !process.env.DATABASE
    || !process.env.DB_USER || !process.env.DB_PWD || !process.env.USER_ADMIN
    || !process.env.USER_ADMIN_PWD) {
    console.log('Usage: requires env variables: \n\
                LOCAL_USER: New user to be stored locally. \n\
                LOCAL_PWD: Password for new user. \n\
                DATABASE: The database to access. \n\
                DB_USER: A database handler user with readWrite. \n\
                DB_PWD: Database password. \n\
                USER_ADMIN: A database handler user with userAdmin. \n\
                USER_ADMIN_PWD: The password for userAdmin. \n\n\
                Optional env varibles: \n\
                SSL: if ssl is true. \n');
    process.exit(1);
}

var localUser = process.env.LOCAL_USER,
    localPass = process.env.LOCAL_PWD;

var options = {
    db: process.env.DATABASE,
    name: process.env.DB_USER,
    pwd: process.env.DB_PWD,
    userAdmin: process.env.USER_ADMIN,
    userAdminPwd: process.env.USER_ADMIN_PWD,
    ssl: process.env.SSL
};

var optionsBadHandler = {
    db: process.env.DATABASE,
    name: 'invalid',
    pwd: 'invalid',
    userAdmin: 'invalid',
    userAdminPwd: 'invalid',
    ssl: process.env.SSL
};

var optionsBadDb = {
    db: process.env.DATABASE,
    port: 3000,
    name: process.env.DB_USER,
    pwd: process.env.DB_PWD,
    userAdmin: process.env.USER_ADMIN,
    userAdminPwd: process.env.USER_ADMIN_PWD,
    ssl: process.env.SSL
};

var user = require('../lib/users.js')(options);
var badUser = require('../lib/users.js')(optionsBadHandler);
var badDb = require('../lib/users.js')(optionsBadDb);

users = {
    'users.js is loaded': {
        topic: function() {
            return user;
        },
        'is object': function(topic) {
            assert.isObject({user: true});
        },
        'has method registerLocal': function(topic) {
            assert.isFunction(topic.registerLocal);
        },
        'has method removeLocal': function(topic) {
            assert.isFunction(topic.removeLocal);
        },
        'has method registerCr': function(topic) {
            assert.isFunction(topic.registerCr);
        },
        'has method removeCr': function(topic) {
            assert.isFunction(topic.removeCr);
        }
    },
};

registerValid = {
    'Registering new valid local user': {
        topic: function() {
            var self = this;
            user.registerLocal(localUser, localPass, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

registerAlreadyUsed = {
    'Registering used local user': {
        topic: function() {
            var self = this;
            user.registerLocal(localUser, localPass, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

registerBadHandler = {
    'Registering local user with bad handler': {
        topic: function() {
            var self = this;
            badUser.registerLocal(localUser, localPass, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

registerBadDb = {
    'Registering local user with bad Db': {
        topic: function() {
            var self = this;
            badDb.registerLocal(localUser, localPass, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

removeValid = {
    'Removing local user': {
        topic: function() {
            var self = this;
            user.removeLocal(localUser, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return true': function(err, removed){
            assert.isNull(err);
            assert.isTrue(removed);
        }
    }
};

removeInvalid = {
    'Removing nonexistent local user': {
        topic: function() {
            var self = this;
            user.removeLocal('invalid', function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

removeBadHandler = {
    'Removing local user with bad handler': {
        topic: function() {
            var self = this;
            badUser.removeLocal(localUser, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

removeBadDb = {
    'Removing local user with bad Db': {
        topic: function() {
            var self = this;
            badDb.removeLocal(localUser, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

registerValidCr = {
    'Registering new valid CR user': {
        topic: function() {
            var self = this;
            user.registerCr(localUser, localPass, null, null, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

registerAlreadyUsedCr = {
    'Registering used CR user': {
        topic: function() {
            var self = this;
            user.registerCr(localUser, localPass, null, null, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

registerBadHandlerCr = {
    'Registering CR user with bad handler': {
        topic: function() {
            var self = this;
            badUser.registerCr(localUser, localPass, null, null, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

registerBadDbCr = {
    'Registering CR user with bad Db': {
        topic: function() {
            var self = this;
            badDb.registerCr(localUser, localPass, null, null, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

removeValidCr = {
    'Removing CR user': {
        topic: function() {
            var self = this;
            user.removeCr(localUser, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return true': function(err, removed){
            assert.isNull(err);
            assert.isTrue(removed);
        }
    }
};

removeInvalidCr = {
    'Removing nonexistent CR user': {
        topic: function() {
            var self = this;
            user.removeCr('invalid', function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

removeBadHandlerCr = {
    'Removing CR user with bad handler': {
        topic: function() {
            var self = this;
            badUser.removeCr(localUser, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

removeBadDbCr = {
    'Removing CR user with bad Db': {
        topic: function() {
            var self = this;
            badDb.removeCr(localUser, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

vows.describe('users.js').addBatch(users).addBatch(registerValid).addBatch(registerAlreadyUsed).addBatch(registerBadHandler).addBatch(registerBadDb).addBatch(removeValid).addBatch(removeInvalid).addBatch(removeBadHandler).addBatch(removeBadDb).addBatch(registerValidCr).addBatch(registerAlreadyUsedCr).addBatch(registerBadHandlerCr).addBatch(registerBadDbCr).addBatch(removeValidCr).addBatch(removeInvalidCr).addBatch(removeBadHandlerCr).addBatch(removeBadDbCr).export(module);
