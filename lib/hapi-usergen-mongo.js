exports.register = function (plugin, options, next) {
    var user = require('./users.js')(options);
    plugin.expose('user', user);
    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
