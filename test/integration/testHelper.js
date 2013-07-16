module.exports = function () {
    "use strict";

    //TODO: Encapsulate mongoose connectivity and setup into module
    var config = require('../../lib/config/test.json'),
        mongoose = require('mongoose'),
        credentials = config.database.username && config.database.password ? config.database.username + ":" + config.database.password + "@" : '',
        url = "mongodb://" + credentials + config.database.host + ":" + config.database.port + "/" + config.database.name,
        clearDb = require('mocha-mongoose')(url);

    return {
        config: config,
        mongoose: mongoose,
        clearDb: clearDb,
        connect: function (done) {
            if (mongoose.connection.db) {
                return done();
            }

            mongoose.connect(url, done);
        },
        disconnect: function (done) {
            mongoose.disconnect(done);
        }
    };
};