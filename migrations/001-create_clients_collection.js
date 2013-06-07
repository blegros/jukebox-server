var Q = require('q'),
    Helper = require('./migrationHelper')();

exports.up = function (next) {
    Helper.connect
        .then(function (db) {
            return Q.ninvoke(db, 'createCollection', 'clients');
        })
        .then(Helper.close)
        .then(function () {
            next();
        });
};

exports.down = function (next) {
    Helper.connect
        .then(function (db) {
            return Q.ninvoke(db, 'dropCollection', 'clients');
        })
        .then(Helper.close)
        .then(function () {
            next();
        });
};