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

    User.registerLocal = function(name, password, callback) {
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

                        if (doc != null) {
                            db.close();
                            return callback(new Error('Email or name already in use'));
                        }
                        else {
                            bcrypt.hash(password, 10, function(err, hash) {
                                collection.insert([{_id: name, local: {name: name, pwd: hash}}],
                                function(err, data) {
                                    if (err) {
                                        db.close();
                                        return callback(err);
                                    }

                                    db.close();
                                    return callback(null, true);
                                });
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

    User.registerCr = function(name, password, roles, data, callback) {
        roles = roles || [];
        data = data || {};

        db.open(function(err, db) {
            if (err) {
                return callback(err);
            }

            db.authenticate(userAdmin, userAdminPwd, function(err, result) {
                if (err) {
                    db.close();
                    return callback(new Error('User Admin incorrect'));
                }

                db.addUser(name, password, {roles: roles, customData: data}, function(err, result) {
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

    User.registerLocalGithub = function(name, password, callback) {
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

                        if (doc != null) {
                            if (doc.github) {
                                db.close();
                                return callback(new Error('Email or name already in use'));
                            }
                            else {
                                collection.update({_id: name}, {$set: {github: {name: name, pwd: password}}}, function(err, data) {
                                    if (err) {
                                        db.close();
                                        return callback(err);
                                    }

                                    db.close();
                                    console.log(data);
                                    return callback(null, true);
                                });
                            }
                        }
                        else {
                            collection.insert([{_id: name, github: {name: name, pwd: password}}], function(err, data) {
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
