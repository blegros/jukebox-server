module.exports = function (config, mongoose) {
    "use strict";

    //constants
    var RECENT_LIMIT = 15;

    var schema = new mongoose.Schema({
        trackId: String,
        jukebox: { type: mongoose.Schema.Types.ObjectId, ref: 'Jukebox' },
        queuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
        queuedAt: Date,
        playedAt: Date,
        votes: {
            likes: {
                type: Number,
                'default': 0
            },
            dislikes: {
                type: Number,
                'default': 0
            }
        }
    }, {
        autoIndex: false
    });

    /**
     * Creates a new track on a jukebox
     *
     * @param jukebox
     * @param callback function(err, track) { ... }
     */
    schema.methods.create = function (jukebox, callback) {
        this.jukebox = jukebox.id;
        this.save(callback);
    };

    schema.methods.canVote = function () {
        return this.jukebox.nowPlaying === this.id;
    };

    /**
     * Records a vote associated with a playing track
     *
     * @param vote either -1 or 1, anything other than -1 will be considered a positive vote
     * @param callback function (err) { ... }
     */
    schema.methods.vote = function (vote, callback) {
        //don't let them vote if the track isn't playing
        if (!this.canPlay()) {
            return;
        }

        //decide how to cast vote
        if (vote === -1) {
            this.votes.dislikes++;
        }
        else {
            this.votes.likes++;
        }

        this.save(function (err) {
            if (err && callback) {
                callback(err);
            }
        });
    };

    /**
     * Returns the most recently played tracks for the provided jukebox
     *
     * @param jukebox
     * @param callback function(err, tracks) { ... }
     */
    schema.statics.findRecentlyPlayed = function (jukebox, callback) {
        this.find({ jukebox: jukebox.id })
            .where('playedAt').lte(new Date())
            .limit(RECENT_LIMIT)
            .exec(callback);
    };

    /**
     * Returns the tracks which are queued but have not yet been played on the provided jukebox
     *
     * @param jukebox
     * @param callback function(err, tracks) { ... }
     */
    schema.statics.findUnPlayed = function (jukebox, callback) {
        this.find({ jukebox: jukebox.id, playedAt: null })
            .exec(callback);
    };

    return mongoose.model('Track', schema);
};