/*
 GET /jukeboxes/lat=;long=/nearest
 POST /jukeboxes
 GET /jukeboxes/{id}
 PUT /jukeboxes/{id}
 GET /jukeboxes/{id}/tracks --> Gets now_playing, queued, and recent
 POST /jukesboxes/{id}/tracks
 GET /jukesboxes/{id}/tracks/now_playing
 GET /jukeboxes/{id}/tracks/recent
 GET /jukeboxes/{id}/tracks/queued
 GET /jukeboxes/{id}/tracks/{id}
 DELETE /jukeboxes/{id}/tracks/{id}
 POST /jukeboxes/{id}/tracks/{id}/vote
 GET /jukeboxes/{id}/clients

 MAYBE:
 GET /jukeboxes/{id}/checkins
 POST /jukeboxes/{id}/checkins
 GET /providers/{name}/search?q={query_string}
 GET /providers/{name}/{credentials}/playlists
 GET /providers/{name}/{credentials}/playlists/{id}

 Needed operations:
 - List jukeboxes nearest to provided lat/long
 - Show top 3 popular genres for tracks played on jukebox
 - Get jukebox track currently playing
 - Like/dislike track playing on jukebox
 - Get jukebox track currently playing approval rating
 - Get next track to be played on a jukebox
 - Push now playing track to active clients
 - Get last 10 tracks played on jukebox
 - Get 10 most recent checkins from LinkedIn
 - Get total number of checkins for day from LinkedIn
 - Checkin on LinkedIn
 - Query radio provider for tracks matching string
 - Select track from search to queue into jukebox
 - List playlists for a user with a provider
 - List tracks on playist for a user with a provider
 - Select track from playlist to queue into jukebox
 - Save credentials for fixed list of providers
 - Restrict adding tracks with password
 - Restrict frequency of track adds by user on user defined interval
 - Restrict the total number of tracks waiting to be played
 - Create jukebox
 - Jukebox player ?????
 - Play/pause/skip track
 - Apply volume lock
 - Crossfade tracks
 - View track information
 - View all connected clients
 - Integrate with LinkedIn venue ID to view checkin distribution
 - View all queued tracks
 - Remove queued track
 - Move queued track
 - View track history for interval
 - Submit user badges to LinkedIn for using jukebox
 - 10 tracks queued
 - 50 tracks queued
 - 100 tracks queued
 - 250 tracks queued
 - 500 tracks queued
 - 1000 tracks queued
 - Mr. Positive - up-vote ratio higher than 75%
 - Debby Downer - down-vote ration higher than 75%
 - Show venue related specials from LinkedIn on Jukebox
 - Delete jukebox
 - Favorite jukeboxes
 */

var express = require('express'),
    Resource = require('express-resource'),
    http = require('http'),
    path = require('path');

var app = express();

//load app config
var config = require('./config/default.json');

//configure express
app.set('port', config.port);
app.use(express.logger(config.logger.level));
app.use(express.compress());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500);
    next(err);
});

// configure ORM and load model definitions
var models = require('./models')(config);
app.set('models', models);

//setup routes
require("./resources")(app, app.get('models'));

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
