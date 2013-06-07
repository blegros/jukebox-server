var Q = require('q'),
    Helper = require('./migrationHelper')();

exports.up = function (next) {
    Helper.connect
        .then(function (db) {
            return Q.ninvoke(db, 'createCollection', 'tracks');
        })
        .then(function (collection) {
            return Q.ninvoke(collection, 'ensureIndex', { jukebox: 1, queuedAt: 1 });
        })
        .then(Helper.close)
        .then(function () {
            next();
        });
};

exports.down = function (next) {
    Helper.connect
        .then(function (db) {
            return Q.ninvoke(db, 'dropCollection', 'tracks');
        })
        .then(Helper.close)
        .then(function () {
            next();
        });
};
