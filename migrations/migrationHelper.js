module.exports = function () {
    "use strict";

    var Q = require('q'),
        config = require('../config/default.json'),
        client = require('mongodb'),
        url = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name,
        connectionPromise = Q.ninvoke(client, 'connect', url);

    Q.onerror = function(err) {
        console.error(err);
    };

    return {
        connect: connectionPromise,
        close: function () {
            return connectionPromise.then(function(db) {
                db.close();
            });
        },
        error: function (err) {
            console.log(err);
        }
    };
};