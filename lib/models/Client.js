module.exports = function (config, mongoose) {
    "use strict";

    var schema = new mongoose.Schema({
        qualifier: String,
    }, {
        autoIndex: false
    });

    return mongoose.model('Client', schema);
};