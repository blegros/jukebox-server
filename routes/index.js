module.exports = function (app, models, controllers) {
    "use strict";

    console.log('Loading routes ...');

    // setup default resources
    var jukeboxesResource = app.resource('jukeboxes', controllers.Jukebox);
    var tracksResource = app.resource('tracks', controllers.Track);
    jukeboxesResource.add(tracksResource);

    //setup custom mappings
    app.get('/jukeboxes/lat=:lat;long=:long/nearest', controllers.Jukebox.findNearest);
    app.get('/jukeboxes/:jukeboxId/tracks/now_playing', controllers.Track.showNowPlaying);
    app.get('/jukeboxes/:jukeboxId/tracks/recent', controllers.Track.showRecent);
    app.get('/jukeboxes/:jukeboxId/tracks/queued', controllers.Track.showQueued);
    app.post('/jukeboxes/:jukeboxId/tracks/:trackId/vote', controllers.Track.vote);
    app.get('/jukeboxes/:jukeboxId/clients', controllers.Jukebox.showClients);
};