var mongodb = require('mongodb'),
    config = require('../config/default.json');

var client = mongodb.MongoClient;
var url = "mongodb://" + config.database.host + ":" + config.database.port + "/" + config.database.name;

exports.up = function (next) {
    client.connect(url, function (err, db) {
        "use strict";

        db.createCollection('jukeboxes', function(err, collection) {
            if(err){
                console.log(err);
            }

            collection.ensureIndex({ address: 1, city: 1, state: 1, postalCode: 1}, { unique: true }, function(err, indexName){
                if(err){
                    console.log(err);
                }

                collection.ensureIndex({ location: '2dsphere' }, function(err, indexName){
                    if(err){
                        console.log(err);
                    }

                    db.close();

                    next();
                });
            });
        });
    });
};

exports.down = function (next) {
    client.connect(url, function (err, db) {
        "use strict";

        db.dropCollection('jukeboxes', function(err, result) {
            if(err){
                console.log(err);
            }

            db.close();

            next();
        });
    });
};