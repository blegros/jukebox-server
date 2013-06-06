module.exports = function (config, mongoose) {
    "use strict";

    var schema = new mongoose.Schema({
        trackId: String,
        jukebox: mongoose.Schema.Types.ObjectId,
        queuedAt: Date,
        playedAt: Date,
        votes: {
            likes: {
                type: Number,
                default: 0
            },
            dislikes: {
                type: Number,
                default: 0
            }
        }
    }, {
        autoIndex: false
    });

    return mongoose.model('Track', schema);
};