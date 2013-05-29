module.exports = function (sequelize, DataTypes) {
    "use strict";

    return sequelize.define('Track', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            trackId: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            trackPlayTimestamp: {
                type: DataTypes.DATE,
            },
            votesFor: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    notNull: true,
                    isInt: true
                }
            },
            votesAgainst: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                validate: {
                    notNull: true,
                    isInt: true
                }
            }
        },
        {
            tableName: 'tracks'
        }
    );
};