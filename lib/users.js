var Mongo = require('mongodb'),
    Db = Mongo.Db,
    Server = Mongo.Server;

var bcrypt = require('bcrypt');

module.exports = function(options) {
    options = options || {};
    var ip = options.ip || '127.0.0.1',
        port = options.port || 27017,
        dbName = options.db || 'test',
        dbUser = options.name,
        dbPwd = options.pwd,
        userAdmin = options.userAdmin,
        userAdminPwd = options.userAdminPwd,
        ssl = options.ssl;

    var server = new Server(ip, port, {ssl: ssl}),
        db = new Db(dbName, server, {w: 1});

    var User = {};

    User.registerLocal = function(user, data, callback) {

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        user = args.shift();
        callback = args.pop();
        data = (args.length > 0) ? args.shift() : null;

        if (!user.name || !user.pwd) {
            return callback(new Error('User must have name and password'));
        }

        db.open(function(err, db) {
            if (err) {
                return callback(err);
            }

            db.authenticate(dbUser, dbPwd, function(err, result) {
                if (err) {
                    db.close();
                    return callback(new Error('Database handler incorrect'));
                }

                db.createCollection('users', function(err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    collection.findOne({'_id': user.name}, function(err, doc) {
                        if (err) {
                            db.close();
                            return callback(err);
                        }

                        if (doc != null) {
                            db.close();
                            return callback(new Error('Email or name already in use'));
                        }
                        else {
                            bcrypt.hash(user.pwd, 10, function(err, hash) {
                                user.pwd = hash;

                                if (!data) {
                                    collection.insert({'_id': user.name, 'local': user},
                                    function(err, data) {
                                        if (err) {
                                            db.close();
                                            return callback(err);
                                        }

                                        db.close();
                                        return callback(null, true);
                                    });
                                }
                                else {
                                    collection.insert({'_id': user.name, 'local': user, 'data': data},
                                    function(err, data) {
                                        if (err) {
                                            db.close();
                                            return callback(err);
                                        }

                                        db.close();
                                        return callback(null, true);
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    };

    User.removeLocal = function(name, callback) {
        db.open(function(err, db) {
            if (err) {
                return callback(err);
            }

            db.authenticate(dbUser, dbPwd, function(err, result) {
                if (err) {
                    db.close();
                    return callback(new Error('Database handler incorrect'));
                }

                db.createCollection('users', function(err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    collection.findOne({_id: name}, function(err, doc) {
                        if (err) {
                            db.close();
                            return callback(err);
                        }

                        if (doc === null) {
                            db.close();
                            return callback(new Error('User not found'));
                        }
                        else {
                            collection.remove({_id: name}, function(err, result) {
                                if (err) {
                                    db.close();
                                    return callback(err);
                                }

                                db.close();
                                return callback(null, true);
                            });
                        }
                    });
                });
            });
        });
    };

    User.registerCr = function(user, roles, data, callback) {

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        user = args.shift();
        callback = args.pop();
        roles = (args.length > 0 && args[0] instanceof Array) ? args.shift() : [];
        data = (args.length > 0) ? args.shift() : {};

        if (!user.name || !user.pwd) {
            return callback(new Error('User must have name and password'));
        }

        db.open(function(err, db) {
            if (err) {
                return callback(err);
            }

            db.authenticate(userAdmin, userAdminPwd, function(err, result) {
                if (err) {
                    db.close();
                    return callback(new Error('User Admin incorrect'));
                }

                db.addUser(user.name, user.pwd, {roles: roles, customData: data}, function(err, result) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    db.close();
                    return callback(null, true);
                });
            });
        });
    };

    User.removeCr = function(name, callback) {
        db.open(function(err, db) {
            if (err) {
                return callback(err);
            }

            db.authenticate(userAdmin, userAdminPwd, function(err, result) {
                if (err) {
                    db.close();
                    return callback(err);
                }

                db.removeUser(name, function(err, result) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    db.close();
                    return callback(null, true);
                });
            });
        });
    };

    User.registerLocalGithub = function(user, data, callback) {

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        user = args.shift();
        callback = args.pop();
        data = (args.length > 0) ? args.pop() : {};

        if (!user.name || !user.pwd) {
            return callback(new Error('User must have name and password'));
        }

        db.open(function(err, db) {
            if (err) {
                return callback(err);
            }

            db.authenticate(dbUser, dbPwd, function(err, result) {
                if (err) {
                    db.close();
                    return callback(new Error('Database handler incorrect'));
                }

                db.createCollection('users', function(err, collection) {
                    if (err) {
                        db.close();
                        return callback(err);
                    }

                    collection.findOne({'_id': user.name}, function(err, doc) {
                        if (err) {
                            db.close();
                            return callback(err);
                        }

                        if (doc != null) {
                            if (doc.github) {
                                db.close();
                                return callback(new Error('Email or name already in use'));
                            }
                            else {
                                collection.update({'_id': user.name}, {'$set': {'github': user}}, function(err, data) {
                                    if (err) {
                                        db.close();
                                        return callback(err);
                                    }

                                    db.close();
                                    return callback(null, true);
                                });
                            }
                        }
                        else {
                            collection.insert({'_id': user.name, 'github': user, 'data': data}, function(err, data) {
                                if (err) {
                                    db.close();
                                    return callback(err);
                                }

                                db.close();
                                return callback(null, true);
                            });
                        }
                    });
                });
            });
        });
    };

    return User;
};
