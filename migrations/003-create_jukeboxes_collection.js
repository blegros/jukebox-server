var Q = require('q'),
    Helper = require('./migrationHelper')();

exports.up = function (next) {
    Helper.connect
        .then(function (db) {
            return Q.ninvoke(db, 'createCollection', 'jukeboxes');
        })
        .then(function (collection) {
            return Q.ninvoke(collection, 'ensureIndex', { address: 1, city: 1, state: 1, postalCode: 1}, { unique: true })
                .then(function () {
                    return collection;
                });
        })
        .then(function (collection) {
            return Q.ninvoke(collection, 'ensureIndex', { location: '2dsphere' });
        })
        .then(Helper.close)
        .then(function () {
            next();
        })
        .fail(Helper.error);
};

exports.down = function (next) {
    Helper.connect
        .then(function (db) {
            return Q.ninvoke(db, 'dropCollection', 'jukeboxes');
        })
        .then(Helper.close)
        .then(function () {
            next();
        })
        .fail(Helper.error);
};