module.exports = function (config, mongoose) {
    "use strict";

    var schema = new mongoose.Schema({
        name: String,
        address: String,
        city: String,
        state: String,
        postalCode: String,
        location: [Number],
        password: String,
        clientPassword: String,
        masterVolumeLevel: {
            type: Number,
            min: 0,
            max: 10
        },
        maxQueuesPerClient: Number,
        maxQueueLength: Number,
        crossFadeTracks: Boolean,
        tracks: [mongoose.Schema.Types.ObjectId],
        clients: [mongoose.Schema.Types.ObjectId]
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

    return mongoose.model('Jukebox', schema);
};