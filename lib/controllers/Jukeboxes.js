module.exports = function (models) {
    "use strict";

    var Jukebox = models.Jukebox;

    return {
        /**
         * express-resource hook to load a jukebox, the currently playing track, and its clients by ID
         *
         * @param req
         * @param id
         * @param fn
         */
        load: function (req, id, fn) {
            Jukebox.findById(id)
                .populate('clients')
                .populate('nowPlaying')
                .exec(function (err, jukebox) {
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
         * @apiError (404) NoJukeboxesNearLocation The id of the Jukebox was not found.
         */

        /**
         * Finds all jukeboxes within a radius of the provided location
         *
         * @param req
         * @param res
         */
        findNearest: function (req, res) {
            Jukebox.findNearest(req.params.long, req.params.lat, req.params.range, function (err, jukeboxes) {
                if (jukeboxes.length === 0) {
                    res.send(404);
                    return;
                }

                res.json(jukeboxes);
            });
        },

        /**
         * express-resource hook to create a jukebox
         *
         * @param req
         * @param res
         */
        create: function (req, res) {
            var jukebox = new Jukebox(req.body);
            jukebox.create(function (error, created) {
                if (error) {
                    res.json(400, error);
                    return;
                }

                res.location('/jukeboxes/' + created.id);
                res.send(201);
            });
        },

        /**
         * express-resource hook to get a jukebox id
         *
         * @param req
         * @param res
         */
        show: function (req, res) {
            res.json(req.jukebox);
        },

        /**
         * Shows all currently connected clients
         *
         * @param req
         * @param res
         */
        showClients: function (req, res) {
            res.json(req.jukebox.clients);
        },

        /**
         * express-resource hook to update a jukebox based on its id
         *
         * @param req
         * @param res
         */
        update: function (req, res) {
            var jukebox = req.jukebox;
            jukebox.update(req.body, function (err, updated) {
                if (err) {
                    res.json(400, err);
                    return;
                }

                res.json(updated);
            });
        },

        /**
         * express-resource hook to remove a jukebox
         *
         * @param req
         * @param res
         */
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