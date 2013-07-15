module.exports = function (models) {
    "use strict";

    var Track = models.Track;

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
                res.send(404);
                return;
            }

            res.json(jukebox.nowPlaying);
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
                    res.send(404);
                }

                res.json(tracks);
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
                    res.send(404);
                    return;
                }

                res.json(tracks);
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
                    res.json(400, err);
                    return;
                }

                res.location('/jukeboxes/' + jukebox.id + '/tracks/' + created.id);
                res.send(201);
            });
        },

        /**
         * express-resource hook to show the details of a track queued with a jukebox
         *
         * @param req
         * @param res
         */
        show: function (req, res) {
            res.json(req.track);
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
                res.send(405);
                return;
            }

            track.vote(vote, function (err) {
                if (err) {
                    res.send(500);
                }

                res.send(200);
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
                res.send(405);
                return;
            }

            track.remove(function (err) {
                if (err) {
                    res.json(500, err);
                    return;
                }

                res.send(200);
            });
        }
    };
};