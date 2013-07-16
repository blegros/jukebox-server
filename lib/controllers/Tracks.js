module.exports = function (models) {
    "use strict";

    var Track = models.Track;

    /**
     * Creates a resource URL for a track
     *
     * @param track
     * @returns {string}
     */
    var createResourceUrl = function (track) {
        var id = '/' + track.id || '';
        return '/jukeboxes/' + track.jukebox.id + '/tracks' + id;
    };

    return {
        /**
         * express-resource hook to load a track by ID based on a jukebox
         *
         * @param req
         * @param id
         * @param fn
         */
        load: function (req, id, fn) {
            Track.findById(id, function (err, track) {
                //if we found the track and didn't error, set the jukebox
                if (!err && track) {
                    track.jukebox = req.jukebox;
                }

                fn(null, track);
            });
        },

        /**
         * Shows the track currently playing on the jukebox
         *
         * @param req
         * @param res
         */
        showNowPlaying: function (req, res) {
            var jukebox = req.jukebox;
            if (!jukebox.nowPlaying) {
                return res.send(404);
            }

            return res.json(jukebox.nowPlaying);
        },

        /**
         * Shows the most recently played tracks for a jukebox
         *
         * @param req
         * @param res
         */
        showRecent: function (req, res) {
            Track.findRecentlyPlayed(req.jukebox, function (err, tracks) {
                if (!tracks) {
                    return res.send(404);
                }

                return res.json(tracks);
            });
        },

        /**
         * Shows all un-played tracks for a jukebox
         *
         * @param req
         * @param res
         */
        showUnPlayed: function (req, res) {
            Track.findUnPlayed(req.jukebox, function (err, tracks) {
                if (!tracks) {
                    return res.send(404);
                }

                return res.json(tracks);
            });
        },

        /**
         * express-resource hook to queue a track onto a jukebox
         *
         * @param req
         * @param res
         */
        create: function (req, res) {
            var template = req.body;
            var jukebox = req.jukebox;

            var track = new Track(template);
            track.create(jukebox, function (err, created) {
                if (err) {
                    if (err.name && err.name === 'ValidationError') {
                        return res.json(400, err);
                    }

                    return res.json(500, err);
                }

                res.location(createResourceUrl(created));
                return res.send(201);
            });
        },

        /**
         * express-resource hook to show the details of a track queued with a jukebox
         *
         * @param req
         * @param res
         */
        show: function (req, res) {
            return res.json(req.track);
        },

        /**
         * Marks the track as being played on its jukebox
         *
         * @param req
         * @param res
         */
        play: function (req, res) {
            var track = req.track;
            track.play(function (err) {
                if (err) {
                    return res.send(500);
                }

                return res.send(200);
            });
        },

        /**
         * Ability to vote for, or against, a currently playing track on a specific jukebox
         *
         * @param req
         * @param res
         */
        vote: function (req, res) {
            var track = req.track,
                vote = req.body.vote;

            //make sure we're allowed to vote
            if (!track.canVote()) {
                return res.send(405);
            }

            track.vote(vote, function (err) {
                if (err) {
                    return res.send(500);
                }

                return res.send(200);
            });
        },

        /**
         * Marks the track as finished being played on its jukebox
         *
         * @param req
         * @param res
         */
        done: function (req, res) {
            var track = req.track;
            track.done(function (err) {
                if (err) {
                    return res.send(500);
                }

                res.setLocation(createResourceUrl() + '/next');
                return res.send(200);
            });
        },

        /**
         * Gets the resource URL for the next track to play
         *
         * @param req
         * @param res
         */
        next: function (req, res) {
            Track.findNext(req.jukebox, function (err, track) {
                if (err) {
                    return res.send(500);
                }

                if (!track) {
                    return res.send(404);
                }

                res.location(createResourceUrl(track));
                return res.send(200);
            });
        },

        /**
         * express-resource hook to remove an unplayed track from a jukebox
         *
         * @param req
         * @param res
         */
        destroy: function (req, res) {
            var track = req.track;

            //make sure we only remove tracks that haven't been played
            if (track.playedAt) {
                return res.send(405);
            }

            track.remove(function (err) {
                if (err) {
                    return res.json(500, err);
                }

                return res.send(200);
            });
        }
    };
}
;