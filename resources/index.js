module.exports = function (app, models) {
    "use strict";

    // setup default resources
    var jukeboxesController = require('./jukeboxes')(models);
    var jukeboxesResource = app.resource('jukeboxes', jukeboxesController);

    var tracksController = require('./tracks')(models);
    var tracksResource = app.resource('tracks', tracksController);
    jukeboxesResource.add(tracksResource);

    //setup custom mappings
    app.get('/jukeboxes/lat=:lat;long=:long/nearest', jukeboxesController.findNearest);
    app.get('/jukeboxes/:jukeboxId/tracks/now_playing', tracksController.showNowPlaying);
    app.get('/jukeboxes/:jukeboxId/tracks/recent', tracksController.showRecent);
    app.get('/jukeboxes/:jukeboxId/tracks/queued', tracksController.showQueued);
    app.post('/jukeboxes/:jukeboxId/tracks/:trackId/vote', tracksController.vote);
    app.get('/jukeboxes/:jukeboxId/clients', jukeboxesController.showClients);
};