module.exports = function (models) {
    "use strict";

    var Jukebox = models.Jukebox;

    return {
        load: function (req, id, fn) {
            Jukebox.findById(id, '-tracks -clients', function (err, jukebox) {
                fn(null, jukebox);
            });
        },

        findNearest: function (req, res) {
            var locationLat = req.params.lat;
            var locationLong = req.params.long;

            Jukebox.nearSphere("location", {
                geometry: {
                    type: "Point",
                    coordinates: [locationLong, locationLat]
                }
            })
                .maxDistance(25)
                .exec(function (err, jukeboxes) {
                    res.json(jukeboxes);
                });
        },

        create: function (req, res) {
            var template = req.body;

            var jukebox = new Jukebox(template);
            if (jukebox.password) {
                jukebox.encodePassword(jukebox.password);
            }

            if (jukebox.clientPassword) {
                jukebox.encodeClientPassword(jukebox.clientPassword);
            }

            jukebox.save(function (err, created) {
                if (err) {
                    res.json(400, err);
                    return;
                }

                res.location('/jukeboxes/' + created.id);
                res.send(201);
            });
        },

        show: function (req, res) {
            res.json(req.jukebox);
        },

        showClients: function (req, res) {
            res.send(501);
        },

        update: function (req, res) {
            var jukebox = req.jukebox;
            jukebox.findByIdAndUpdate(jukebox.id, { $set: req.body }, function (err, updated) {
                if (err) {
                    res.json(400, err);
                    return;
                }

                res.json(updated);
            });
        },

        destroy: function (req, res) {
            var jukebox = req.jukebox;
            jukebox.remove(function (err) {
                if (err) {
                    res.json(500, err);
                    return;
                }

                res.send(200);
            });
        }
    };
};