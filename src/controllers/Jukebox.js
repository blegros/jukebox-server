module.exports = function (models) {
    "use strict";

    var Jukebox = models.Jukebox;

    return {
        load: function (req, id, fn) {
            Jukebox.findById(id, '-tracks -clients', function (err, jukebox) {
                fn(null, jukebox);
            });
        },

        /**
         * @apiVersion 0.0.1
         * @api {get} /jukeboxes/lat=:lat;long=:long/nearest/:range Find closest jukeboxes
         * @apiName GetNearestJukeboxes
         * @apiGroup Jukeboxes
         * @apiParam {Number} lat Latitude of location to search nearby.
         * @apiParam {Number} long Longitude of location to search nearby.
         * @apiParam {Number} range Number of meters away to check.
         * @apiSuccess {String} id Unique identifier for the jukebox.
         * @apiSuccess {String} name Name of the jukebox, typically a label to refer to the establishment running the jukebox.
         * @apiSuccess {String} address Physical address of the jukebox.
         * @apiSuccess {Array} location Longitude and latitude of the address.
         * @apiSuccessExample Success-Response:
         HTTP/1.1 200 OK
         [{
            "id": "abcd1324jlkjs211",
            "name": "Bob's Bistro",
            "address": "1234 My Road, Melbourne, Fl 32940",
            "location": [30.12, 30.11]
         }, ...]
         * @apiError (404) NoJukeboxesNearLocation The id of the User was not found.
         */
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