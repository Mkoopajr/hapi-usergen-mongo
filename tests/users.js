var vows = require('vows'),
    assert = require('assert');

if (!process.env.LOCAL_USER || !process.env.LOCAL_PWD || !process.env.GITHUB_USER
    || !process.env.USED_USER || !process.env.USED_PWD || !process.env.DATABASE
    || !process.env.DB_USER || !process.env.DB_PWD || !process.env.USER_ADMIN
    || !process.env.USER_ADMIN_PWD) {

    console.log('Usage: requires env variables: \n\
                LOCAL_USER: New user to be stored locally. \n\
                LOCAL_PWD: Password for new user. \n\
                GITHUB_USER: A name or email that\'d be used for github. \n\
                USED_USER: A user already stored in database. \n\
                USED_PWD: Password for used user. \n\
                DATABASE: The database to access. \n\
                DB_USER: A database handler user with readWrite. \n\
                DB_PWD: Database password. \n\
                USER_ADMIN: A database handler user with userAdmin. \n\
                USER_ADMIN_PWD: The password for userAdmin. \n\n\
                Optional env varibles: \n\
                SSL: if ssl is true. \n');
    process.exit(1);
}

var validUser = {
    'name': process.env.LOCAL_USER,
    'pwd': process.env.LOCAL_PWD
};

var userNoPwd = {
    'name': process.env.LOCAL_USER
};

var usedUser = {
    'name': process.env.USED_USER,
    'pwd': process.env.USED_PWD
};

var validUserData = {
    'firstn': 'testy',
    'lastn': 'tester',
    'age': 42,
    'address': {
        'street': '123 test ln',
        'city': 'testville',
        'state': 'testopolis'
    },
    likes: ['testing', 23]
};

var roles = [{'role': 'readWrite', 'db': 'test'}];

var githubUser = {
    'name': process.env.GITHUB_USER,
    'pwd': 'token'
};

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
        },
        'has method registerLocalGithub': function(topic) {
            assert.isFunction(topic.registerLocalGithub);
        }
    },
};

registerValid = {
    'Registering new valid local user': {
        topic: function() {
            var self = this;
            user.registerLocal(validUser, function(err, data) {
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
            user.registerLocal(validUser, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

registerLocalNoPwd = {
    'Registering local user without name or password': {
        topic: function() {
            var self = this;
            user.registerLocal(userNoPwd, function(err, data) {
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
            badUser.registerLocal(validUser, function(err, data) {
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
            badDb.registerLocal(validUser, function(err, data) {
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
            user.removeLocal(validUser.name, function(err, removed) {
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
            badUser.removeLocal(validUser.name, function(err, removed) {
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
            badDb.removeLocal(validUser.name, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

registerValidWithData = {
    'Registering new valid local user with data': {
        topic: function() {
            var self = this;
            user.registerLocal(validUser, validUserData, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

removeValidWithData = {
    'Removing local user with Data': {
        topic: function() {
            var self = this;
            user.removeLocal(validUser.name, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return true': function(err, removed){
            assert.isNull(err);
            assert.isTrue(removed);
        }
    }
};

registerValidCr = {
    'Registering new valid CR user': {
        topic: function() {
            var self = this;
            user.registerCr(validUser,  function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

registerCrNoPwd = {
    'Registering CR user without name or password': {
        topic: function() {
            var self = this;
            user.registerCr(userNoPwd,  function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

registerAlreadyUsedCr = {
    'Registering used CR user': {
        topic: function() {
            var self = this;
            user.registerCr(usedUser, function(err, data) {
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
            badUser.registerCr(validUser, function(err, data) {
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
            badDb.registerCr(validUser, function(err, data) {
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
            user.removeCr(validUser.name, function(err, removed) {
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
            badUser.removeCr(validUser.name, function(err, removed) {
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
            badDb.removeCr(validUser.name, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return error': function(err, removed){
            assert.isNotNull(err);
        }
    }
};

registerValidCrWithData = {
    'Registering new valid CR user with data': {
        topic: function() {
            var self = this;
            user.registerCr(validUser, validUserData,  function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

removeValidCrWithData = {
    'Removing CR user with data': {
        topic: function() {
            var self = this;
            user.removeCr(validUser.name, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return true': function(err, removed){
            assert.isNull(err);
            assert.isTrue(removed);
        }
    }
};

registerValidCrWithRoles = {
    'Registering new valid CR user with roles and data': {
        topic: function() {
            var self = this;
            user.registerCr(validUser, roles, validUserData,  function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

removeValidCrWithRoles = {
    'Removing CR user with roles and data': {
        topic: function() {
            var self = this;
            user.removeCr(validUser.name, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return true': function(err, removed){
            assert.isNull(err);
            assert.isTrue(removed);
        }
    }
};

registerValidGithub = {
    'Registering new valid github user': {
        topic: function() {
            var self = this;
            user.registerLocalGithub(githubUser, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

registerInvalidGithub = {
    'Registering used github user': {
        topic: function() {
            var self = this;
            user.registerLocalGithub(githubUser, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

addGithubValid = {
    'Adding github to valid local user': {
        topic: function() {
            var self = this;
            user.registerLocalGithub(validUser, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

badHandlerGithub = {
    'Registering github user with bad handler': {
        topic: function() {
            var self = this;
            badUser.registerLocalGithub(githubUser, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

badDbGithub = {
    'Registering github user with bad Db': {
        topic: function() {
            var self = this;
            badDb.registerLocalGithub(githubUser, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};

removeGithub = {
    'Removing github user': {
        topic: function() {
            var self = this;
            user.removeLocal(githubUser.name, function(err, removed) {
                self.callback(err, removed);
            });
        },
        'should return true': function(err, removed){
            assert.isNull(err);
            assert.isTrue(removed);
        }
    }
};

registerValidGithubWithData = {
    'Registering new valid github user with data': {
        topic: function() {
            var self = this;
            user.registerLocalGithub(githubUser, validUserData, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return true': function(err, data) {
            assert.isNull(err);
            assert.isTrue(data);
        }
    }
};

registerGithubNoPwd = {
    'Registering github user without name or password': {
        topic: function() {
            var self = this;
            user.registerLocalGithub(userNoPwd, function(err, data) {
                self.callback(err, data);
            });
        },
        'should return error': function(err, data) {
            assert.isNotNull(err);
        }
    }
};


vows.describe('users.js').addBatch(users).addBatch(registerValid).addBatch(registerAlreadyUsed).addBatch(registerBadHandler).addBatch(registerBadDb).addBatch(registerLocalNoPwd).addBatch(removeValid).addBatch(removeInvalid).addBatch(removeBadHandler).addBatch(removeBadDb).addBatch(registerValidWithData).addBatch(registerValidCr).addBatch(registerCrNoPwd).addBatch(registerAlreadyUsedCr).addBatch(registerBadHandlerCr).addBatch(registerBadDbCr).addBatch(removeValidCr).addBatch(removeInvalidCr).addBatch(removeBadHandlerCr).addBatch(removeBadDbCr).addBatch(registerValidCrWithData).addBatch(removeValidCrWithData).addBatch(registerValidCrWithRoles).addBatch(removeValidCrWithRoles).addBatch(registerValidGithub).addBatch(registerInvalidGithub).addBatch(addGithubValid).addBatch(badHandlerGithub).addBatch(badDbGithub).addBatch(removeValidWithData).addBatch(removeGithub).addBatch(registerValidGithubWithData).addBatch(registerGithubNoPwd).addBatch(removeGithub).export(module);
