module.exports = function () {
    "use strict";

    var Q = require('q'),
        config = require('../lib/config')(process.env.NODE_ENV),
        client = require('mongodb'),
        credentials = config.database.username && config.database.password ? config.database.username + ":" + config.database.password + "@" : '',
        url = "mongodb://" + credentials + config.database.host + ":" + config.database.port + "/" + config.database.name;

    console.log("Connecting to " + url + " ...");

    var connectionPromise = Q.ninvoke(client, 'connect', url);

    var onReject = function (err) {
        console.log(err);
        process.exit(123);
    };

    connectionPromise.fail(onReject);

    return {
        connect: connectionPromise,
        close: function () {
            return connectionPromise.then(function (db) {
                db.close();
            });
        },
        error: onReject
    };
};