module.exports = function (models) {
    "use strict";

    var Jukebox = models.Jukebox;

    var onDbError = function (errors) {
        console.error(errors);
    };

    return {
        load: function (req, id, fn) {
            Jukebox.find(id).success(function (jukebox) {
                fn(null, jukebox);
            }).error(onDbError);
        },

        findNearest: function (req, res) {
            res.send(501);
        },

        create: function (req, res) {
            var template = req.body;
            template.id = null;

            var jukebox = Jukebox.build(template);
            if (jukebox.password) {
                jukebox.encodePassword(jukebox.password);
            }

            if (jukebox.clientPassword) {
                jukebox.encodeClientPassword(jukebox.clientPassword);
            }

            var errors = jukebox.validate();

            if (errors) {
                res.json(400, errors);
                return;
            }

            jukebox.save().success(function (created) {
                res.location('/jukeboxes/' + created.id);
                res.send(201);
            }).error(onDbError);
        },

        show: function (req, res) {
            res.json(req.jukebox);
        },

        showClients: function (req, res) {
            res.send(501);
        },

        update: function (req, res) {
            var jukebox = req.jukebox;
            jukebox.updateAttributes(req.body).success(function (updated) {
                res.json(updated);
            }).error(onDbError);
        },

        destroy: function (req, res) {
            var jukebox = req.jukebox;
            jukebox.destroy().success(function () {
                res.send(200);
            }).error(onDbError);
        }
    };
};