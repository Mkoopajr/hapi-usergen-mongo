var vows = require('vows'),
    assert = require('assert');

var hum = require('../lib/hapi-usergen-mongo.js');

tests = {
    'hapi-usergen-mongo.js is loaded': {
        topic: function() {
            return hum;
        },
        'is object': function(topic) {
            assert.isObject(topic);
        },
        'should export register': function(topic) {
            assert.isFunction(topic.register);
        }
    }
}

vows.describe('hapi-usergen-mongo.js').addBatch(tests).export(module);
