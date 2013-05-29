module.exports = function (sequelize, DataTypes) {
    "use strict";

    var crypto = require('crypto');
    var config = require('../config/default.json');  //sucks to do this rather than pass it in, but this is not imported via require

    var hashPassword = function (password, salt) {
            var checksum = crypto.createHash('sha1');
            checksum.update(salt + password);

            return checksum.digest().toString();
        };

    return sequelize.define('Jukebox', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            postalCode: DataTypes.STRING,
            locationLat: {
                type: DataTypes.DECIMAL,
                validate: {
                    notNull: true,
                    isDecimal: true
                }
            },
            locationLong: {
                type: DataTypes.DECIMAL,
                validate: {
                    notNull: true,
                    isDecimal: true
                }
            },
            password: DataTypes.STRING,
            clientPassword: DataTypes.STRING,
            masterVolumeLevel: {
                type: DataTypes.INTEGER,
                validation: {
                    notNull: true,
                    isInt: true
                }
            },
            maxQueuesPerClient: {
                type: DataTypes.INTEGER,
                validation: {
                    notNull: true,
                    isInt: true
                }
            },
            maxQueueLength: {
                type: DataTypes.INTEGER,
                validation: {
                    notNull: true,
                    isInt: true
                }
            },
            crossFadeTracks: DataTypes.BOOLEAN
        },
        {
            tableName: 'jukeboxes',
            instanceMethods: {
                getLocation: function () {
                    return {lat: this.location_lat, long: this.location_long};
                },
                encodePassword: function (new_password) {
                    this.password = hashPassword(new_password, config.secrets.password_salt);
                },
                verifyPassword: function (clear_text_password) {
                    return (this.password === hashPassword(clear_text_password, config.secrets.password_salt));
                },
                encodeClientPassword: function (new_password) {
                    this.clientPassword = hashPassword(new_password, config.secrets.client_password_salt);
                },
                verifyClientPassword: function (clear_text_password) {
                    return (this.password === hashPassword(clear_text_password, config.secrets.client_password_salt));
                }
            }
        }
    );
};