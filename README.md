### hapi-usergen-mongo

[**hapi**](https://github.com/hapijs/hapi) MongoDB user generator

## Install

npm install hapi-usergen-mongo

## Changes from v1 to v2

All user register function no longer take username and password arguments. Instead they take
a object. The object requires name and pwd keys as follows `{'name': username, 'pwd': password}`,
for registerCr those are the only fields that should be used. For registerLocal/Github you can
add in any additional fields you would like.

registerCr no longer requires a value to be passed for roles and customData. Roles must be an array
and customData must be a object if passed.

registerLocal/Github now have a data argument for any additional information you would like stored
with the user. This field is a object.

## Usage

A user generator plugin for hapi and MongoDB. Must have database already set up with one user that
has readWrite role if you are storing local or userAdmin if storing CR. Requires options:
- `ip` - The IP address of the database. Defaults to `127.0.0.1`.
- `port` - The port number of the database Defaults to `27017`.
- `db` - The name of the database. Defaults to `test`.
- `name` and/or `userAdmin`- name is readWrite user. userAdmin is userAdmin user.
- `pwd` and/or 	`userAdminPwd` - pwd is readWrite password. userAdminPwd is userAdmin password.
- `ssl` - MongoDB ssl. Defaults to `false`.

Exports functions:
- `user.registerLocal(user, data, callback)` - User stored as document. Callback is (err, true). Has schema of `{_id: username, local: {name: username, pwd: password}, data: {}}`. Password is stored with bcrypt.
- `user.registerLocalGithub(user, data, callback)` - Github OAuth credentials stored as document. Callback is (err, true). Has schema of `{_id: username, github: {name: username, pwd: token}, data: {}}`.
- `user.removeLocal(username, callback)` - Removes local or github user. Callback is (err, true).
- `user.registerCr(user, roles, customData, callback)` - User stored as MongoDB Challenge-response user. Callback is (err, true).
- `user.removeCr(name, callback)` - Removes Challenge-response user. Callback is (err, true).

Some Notes:
- A user can register local and then register github to link the two. However a user cannot register
github then set up a local account. It will cause a error.
- If both local and challenge-response users are allowed it will not catch duplicate names between
the two. Therefore it's recomended to choose between local/github or challenge-response.

Example set up:
```javascript
var Hapi = require('hapi');

var server = Hapi.createServer('127.0.0.1', 3000);

server.pack.register({
    plugin: require('hapi-usergen-mongo'),
    options: {
        db: 'users',
        name: 'sessionHandler',
        pwd: 'supersecretpassword',
        userAdmin: 'userHandler',
        userAdminPwd: 'supersecretpassword',
        ssl: true
    }
}, function (err) {
    if (err) {
        console.log(err);
    }
});

server.route([
    {
        method: 'POST',
        path: '/registerlocal',
        handler: function (req, res) {
            var user = {'name': req.payload.username, 'pwd': req.payload.password};

            server.plugins['hapi-usergen-mongo'].user.registerLocal(user, function(err, created) {
                if (err) {
                    res(err);
                }

                res(created);
            });
        }
    },
    {
        method: 'POST',
        path: '/registergithub',
        handler: function (req, res) {
            // Getting information from Github for OAuth is up to you.
            // I highly suggest using bell https://github.com/hapijs/bell
            server.plugins['hapi-usergen-mongo'].user.registerGithub({'name': req.payload.username,
            'pwd': req.payload.password}, function(err, created) {
                if (err) {
                    res(err);
                }

                res(created);
            });
        }
    },
    {
        method: 'POST',
        path: '/removelocal',
        handler: function (req, res) {
            server.plugins['hapi-usergen-mongo'].user.removeLocal(req.payload.username,
            function(err, removed) {
                if (err) {
                    res(err);
                }

                res(removed);
            });
        }
    },
    {
        method: 'POST',
        path: '/registercr',
        handler: function (req, res) {
            // Creates a MongoDB user with no roles or customData
            server.plugins['hapi-usergen-mongo'].user.registerCr({'name': req.payload.username,
            'pwd': req.payload.password}, function(err, created) {
                if (err) {
                    res(err);
                }

                res(created);
            });
        }
    },
    {
        method: 'POST',
        path: '/removecr',
        handler: function (req, res) {
            server.plugins['hapi-usergen-mongo'].user.removeCr(req.payload.username,
            function(err, removed) {
                if (err) {
                    res(err);
                }

                res(removed);
            });
        }
    },
]};

server.start();
```

## Testing

Tests are ran using npm test and require the env variables:
- `LOCAL_USER`
- `LOCAL_PWD`
- `GITHUB_USER`
- `USED_USER`
- `USED_PWD`
- `DATABASE`
- `DB_USER`
- `DB_PWD`
- `USER_ADMIN`
- `USER_PWD`

with optional env variables:
- `SSL`

## Future Plans

Add more OAuth options such as twitter, facebook, etc.
