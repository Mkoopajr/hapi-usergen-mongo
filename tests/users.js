var vows = require('vows'),
    assert = require('assert');

if (!process.env.LOCAL_USER || !process.env.LOCAL_PASS || !process.env.DATABASE
    || !process.env.DB_USER || !process.env.DB_PASS) {
    console.log('Usage: requires env variables: \n\
                LOCAL_USER: New user to be stored locally. \n\
                LOCAL_PASS: Password for new user. \n\
                DATABASE: The database to access. \n\
                DB_USER: A database handler user with read/write. \n\
                DB_PASS: Database password. \n\n\
                Optional env varibles: \n\
                SSL: if ssl is true. \n');
    process.exit(1);
}

var localUser = process.env.LOCAL_USER,
    localPass = process.env.LOCAL_PASS;

var options = {
    db: process.env.DATABASE,
    name: process.env.DB_USER,
    pwd: process.env.DB_PASS,
    ssl: process.env.SSL
};

var optionsBadHandler = {
    db: process.env.DATABASE,
    name: 'invalid',
    pwd: 'invalid',
    ssl: process.env.SSL
};

var optionsBadDb = {
    db: process.env.DATABASE,
    port: 3000,
    name: process.env.DB_USER,
    pwd: process.env.DB_PASS,
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
        }
    },
};

registerValid = {
    'Registering new valid user': {
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
    'Registering used user': {
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
    'Registering user with bad handler': {
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
    'Registering user with bad Db': {
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
    'Removing test user': {
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
    'Removing nonexistent user': {
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
    'Removing test user with bad handler': {
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
    'Removing test user with bad Db': {
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

vows.describe('users.js').addBatch(users).addBatch(registerValid).addBatch(registerAlreadyUsed).addBatch(registerBadHandler).addBatch(registerBadDb).addBatch(removeValid).addBatch(removeInvalid).addBatch(removeBadHandler).addBatch(removeBadDb).export(module);
