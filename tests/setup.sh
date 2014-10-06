#!/bin/sh

mongo test --eval 'db.addUser({user: $DB_USER, pwd: $DB_PWD, roles: ["readWrite", "userAdmin"]});'
mongo test --eval 'db.addUser({user: $USED_USER, pwd: $USED_PWD, roles: []})'
mongo admin --eval 'db.addUser({user: "admin", pwd: "admin", roles: ["readWriteAnyDatabase", "userAdminAnyDataBase"]});'
