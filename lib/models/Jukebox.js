module.exports = function (config, mongoose) {
    "use strict";

    var schema = new mongoose.Schema({
        name: String,
        address: String,
        location: [Number],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
        password: String,
        clientPassword: String,
        masterVolumeLevel: {
            type: Number,
            min: 0,
            max: 1
        },
        maxQueuesPerClient: Number,
        maxQueueLength: Number,
        crossFadeTracks: Boolean,
        nowPlaying: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' },
        clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }]
    }, {
        autoIndex: false
    });

    /**
     * Applies an SHA1 hashing algorithm with the provided salt
     *
     * @param password
     * @param salt
     * @returns {string}
     */
    var hashPassword = function (password, salt) {
        var crypto = require('crypto');

        var checksum = crypto.createHash('sha1');
        checksum.update(password + salt);

        return checksum.digest('hex').toString();
    };

    /**
     * Encodes the password to administer the Jukebox
     *
     * @param new_password
     */
    schema.methods.encodePassword = function (new_password) {
        this.password = hashPassword(new_password, config.secrets.password_salt);
    };

    /**
     * Verifies the provided clear text password matched the stored password hash to administer the Jukebox
     *
     * @param clear_text_password
     * @returns {boolean}
     */
    schema.methods.verifyPassword = function (clear_text_password) {
        return (this.password === hashPassword(clear_text_password, config.secrets.password_salt));
    };

    /**
     * Encodes the password to connect to the jukebox
     *
     * @param new_password
     */
    schema.methods.encodeClientPassword = function (new_password) {
        this.clientPassword = hashPassword(new_password, config.secrets.client_password_salt);
    };

    /**
     * Verifies the provided clear text password matched the stored password hash to connect to the Jukebox
     *
     * @param clear_text_password
     * @returns {boolean}
     */
    schema.methods.verifyClientPassword = function (clear_text_password) {
        return (this.password === hashPassword(clear_text_password, config.secrets.client_password_salt));
    };

    /**
     * Creates an instance of a Jukebox, encrypting any passwords
     *
     * @param callback function(err, jukebox) { ... }
     */
    schema.methods.create = function (callback) {
        if (this.password) {
            this.encodePassword(this.password);
        }

        if (this.clientPassword) {
            this.encodeClientPassword(this.clientPassword);
        }

        this.save(callback);
    }

    /**
     * Uses the provided template to update the alterable values for a jukebox
     *
     * @param template
     * @param callback function(err, jukebox) { ... }
     */
    schema.methods.update = function (template, callback) {
        this.name = template.name || this.name;
        this.masterVolumeLevel = template.masterVolumeLevel || this.masterVolumeLevel;
        this.maxQueuesPerClient = template.maxQueuesPerClient || this.maxQueuesPerClient;
        this.maxQueueLength = template.maxQueueLength || this.maxQueueLength;
        this.crossFadeTracks = template.crossFadeTracks || this.crossFadeTracks;

        if (template.password) {
            this.password = this.encodePassword(template.password);
        }

        if (template.clientPassword) {
            this.clientPassword = this.encodeClientPassword(template.clientPassword);
        }

        this.save(callback);
    };

    /**
     * Marks a track as "now playing" on a jukebox and sets its playedAt timestamp.  Optional callback can
     * be provided for errors.
     *
     * @param track
     * @param callback function(err) { ... }
     */
    schema.methods.play = function (track, callback) {
        //tell the jukebox to play the track
        this.nowPlaying = track.id;
        this.save(function (err) {
            //if it couldn't, then stop
            if (err && callback) {
                callback(err);
                return;
            }

            //otherwise, let's tell the track it's being played
            track.playedAt = new Date();
            track.save();
        });
    };

    /**
     * Tell the jukebox its done playing the track
     * @param track
     * @param callback function(err) { ... }
     */
    schema.methods.done = function (track, callback) {
        this.nowPlaying = null;
        this.save(function (err) {
            if (err && callback) {
                callback(err);
            }
        });
    };

    /**
     * Finds all jukeboxes within the provided range based on the provided location
     *
     * @param longitude
     * @param lattitude
     * @param rangeInMeters
     * @param callback function(err, results) { ... }
     */
    schema.statics.findNearest = function (longitude, lattitude, rangeInMeters, callback) {
        var location = [longitude, lattitude];

        this.nearSphere("location", {
            geometry: {
                type: "Point",
                coordinates: location
            }
        })
            .maxDistance(rangeInMeters)
            .exec(callback);
    };

    return mongoose.model('Jukebox', schema);
};