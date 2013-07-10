module.exports = function (config) {
    "use strict";

    var mongoose = require('mongoose'),
        fileSystem = require('fs'),
        instanceUrl = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name,
        models = {};

    //load schema definitions
    fileSystem.readdirSync(__dirname)
        .filter(function (filename) {
            var isHidden = /^\./.test(filename);
            return !isHidden && filename !== 'index.js';
        })
        .forEach(function (filename) {
            console.log('Importing model @ ' + filename + " ...");

            var model = require('./' + filename)(config, mongoose);
            var name = filename.replace(/\.js$/i, "");
            models[name] = model;
        });

    //open connection to mongo db instance
    console.log('Connecting to mongodb instance [' + instanceUrl + '] ...');
    mongoose.connect(instanceUrl, function() {
        console.log('Connected to mongodb instance.');
    });

    //setup default error handler for mongoose
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'mongodb error:'));

    return models;
};