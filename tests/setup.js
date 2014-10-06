#!/usr/bin/env node

var Mongo = require('mongodb'),
    Db = Mongo.Db,
    Server = Mongo.Server;

var database = process.env.DATABASE,
    dbUser = process.env.DB_USER,
    dbPwd = process.env.DB_PWD,
    usedUser = process.env.USED_USER,
    usedPwd = process.env.USED_PWD;

var server = new Server('127.0.0.1', 27017),
    db = new Db(database, server, {w: 1});

db.open(function(err, db) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    var admin = db.db('admin');

    console.log('opened DB');

    db.addUser(dbUser, dbPwd, {roles: ["readWrite", "userAdmin"]},  function(err, result) {
        if (err) {
            db.close();
            console.log(err);
            process.exit(1);
        }

        console.log(dbUser + ' added');

        db.addUser(usedUser, usedPwd, {roles: []}, function(err, result) {
            if (err) {
                db.close();
                console.log(err);
                process.exit(1);
            }

            console.log(usedUser + ' added');

            admin.addUser('admin', 'admin', {roles: ["readWriteAnyDatabase", "userAdminAnyDatabase"]}, function(err, result) {
                if (err) {
                    db.close();
                    console.log(err);
                    process.exit(1);
                }

                db.close();
                console.log('Admin added');
                console.log('done');
                process.exit(0);
            });
        });
    });
});
