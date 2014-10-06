#!/bin/sh

dbUser=$DB_USER
dbPwd=$DB_PWD
usedUser=$USED_USER
userPwd=$USED_PWD

mongo test --eval 'db.addUser({user: $dbUser, pwd: $dbPwd, roles: ["readWrite", "userAdmin"]});'
mongo test --eval 'db.addUser({user: $usedUser, pwd: $usedPwd, roles: []})'
mongo admin --eval 'db.addUser({user: "admin", pwd: "admin", roles: ["readWriteAnyDatabase", "userAdminAnyDataBase"]});'
