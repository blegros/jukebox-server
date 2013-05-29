module.exports = function (databaseConfig) {
    "use strict";

    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(databaseConfig.name, databaseConfig.username, databaseConfig.password, {
        dialect: 'sqlite',
        storage: __dirname + '/../' + databaseConfig.location
    });

    //make sure we pass back a handle to sequelize to query with
    var models = {
        sequelize: sequelize
    };

    //import models
    var modelDefinitions = ['Jukebox', 'Track'];
    modelDefinitions.forEach(function (modelDefinition) {
        models[modelDefinition] = sequelize.import(__dirname + '/' + modelDefinition);
    });

    // describe relationships
    models.Jukebox.hasMany(models.Track);
    models.Track.belongsTo(models.Jukebox);

    return models;
};