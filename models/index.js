module.exports = function (config) {
    "use strict";

    var mongoose = require('mongoose'),
        models = {};

    //load document definitions
    models.Jukebox = require('./Jukebox')(config, mongoose);

    //open connection to mongo db instance
    mongoose.connect("mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name);

    //setup default error handler
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    return models;
};