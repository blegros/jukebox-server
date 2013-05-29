module.exports = function(models) {
    "use strict";

    var Track = models.Track;

    var onDbError = function (errors) {
        console.error(errors);
    };

    return {
        load: function(req, id, fn) {
            var jukebox = req.jukebox;

            Track.find({ where: { jukeboxId: jukebox.id, id: id }}).success(function (track) {
                fn(null, track);
            }).error(onDbError);
        },

        index: function (req, res) {
            res.send(501);
        },

        showNowPlaying: function (req, res) {
            res.send(501);
        },

        showRecent: function (req, res) {
            res.send(501);
        },

        showQueued: function (req, res) {
            res.send(501);
        },

        create: function (req, res) {
            var template = req.body;
            var jukebox = req.jukebox;

            var track = Track.build(template);
            var errors = track.validate();

            if(errors) {
                res.json(400, errors);
                return;
            }

            track.save().success(function (track){
                track.setJukebox(req.jukebox);

                track.save().success(function (finalTrack) {
                    res.location('/jukeboxes/' + jukebox.id + '/tracks/' + finalTrack.id);
                    res.send(201);
                }).error(onDbError);
            }).error(onDbError);
        },

        show: function (req, res) {
            res.json(req.track);
        },

        vote: function (req, res) {
            res.send(501);
        },

        destroy: function (req, res) {
            var track = req.track;

            track.destroy().success(function () {
                res.send(200);
            }).error(onDbError);
        }
    };
};