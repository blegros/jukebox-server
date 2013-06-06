var mongodb = require('mongodb'),
    config = require('../config/default.json');

var client = mongodb.MongoClient;
var url = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name;

exports.up = function (next) {
    client.connect(url, function (err, db) {
        "use strict";

        db.createCollection('clients', function(err, collection) {
            if(err){
                console.log(err);
            }

            db.close();

            next();
        });
    });
};

exports.down = function (next) {
    client.connect(url, function (err, db) {
        "use strict";

        db.dropCollection('clients', function(err, result) {
            if(err){
                console.log(err);
            }

            db.close();

            next();
        });
    });
};
