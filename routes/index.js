module.exports = function (app, models, controllers) {
    "use strict";

    console.log('Loading routes ...');

    // setup default resources
    var jukeboxesResource = app.resource('jukeboxes', controllers.Jukeboxes);
    var tracksResource = app.resource('tracks', controllers.Tracks);
    jukeboxesResource.add(tracksResource);

    //setup custom mappings
    app.get('/jukeboxes/lat=:lat;long=:long/nearest/:range', controllers.Jukeboxes.findNearest);
    app.get('/jukeboxes/:jukeboxId/tracks/now_playing', controllers.Tracks.showNowPlaying);
    app.get('/jukeboxes/:jukeboxId/tracks/recent', controllers.Tracks.showRecent);
    app.get('/jukeboxes/:jukeboxId/tracks/queued', controllers.Tracks.showUnPlayed);
    app.post('/jukeboxes/:jukeboxId/tracks/:trackId/play', controllers.Tracks.play);
    app.post('/jukeboxes/:jukeboxId/tracks/:trackId/vote', controllers.Tracks.vote);
    app.post('/jukeboxes/:jukeboxId/tracks/:trackId/done', controllers.Tracks.done);
    app.get('/jukeboxes/:jukeboxId/tracks/:trackId/next', controllers.Tracks.next);
    app.get('/jukeboxes/:jukeboxId/clients', controllers.Jukeboxes.showClients);
};