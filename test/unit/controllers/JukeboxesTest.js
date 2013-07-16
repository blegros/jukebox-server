var assertions = require('../../assertions')(),
    should = assertions.chai.should(),
    sinon = assertions.sinon;

var JukeboxStaticSpec = {
    findById: function () {
    },
    findNearest: function () {
    }
};

var JukeboxInstanceSpec = {
    create: function () {
    },
    update: function () {
    },
    remove: function () {
    },
    clients: []
};

describe('Given the Jukeboxes controller', function () {
    var Jukebox = null,
        jukebox = null,
        JukeboxController = null;

    beforeEach(function () {
        Jukebox = sinon.mock(JukeboxStaticSpec);
        jukebox = sinon.mock(JukeboxInstanceSpec);
        JukeboxController = require('../../../lib/controllers/Jukeboxes')({ Jukebox: Jukebox });
    });

    describe('when asked to load', function () {
        it('should load a jukebox with its clients and currently playing track');
    });

    describe('when asked to find the closest jukeboxes', function () {
        it('should find jukeboxes by location and range');

        describe('and one or more are found', function () {
            it('should say ok');
        });

        describe('and none are found', function () {
            it('should say not found');
        });
    });

    describe('when asked to create a jukebox', function () {
        describe('and it is invalid', function () {
            it('should say bad request');
        });

        describe('and unknown failure occurs', function () {
            it('should say error');
        });

        describe('and it is valid', function () {
            it('should say created');
        });
    });

    describe('when asked to show a jukebox', function () {
        it('should say ok');
    });

    describe('when asked to show clients of a jukebox', function () {
        describe('and one or more exist', function () {
            it('should say ok');
        });

        describe('and none exist', function () {
            it('should say not found');
        });
    });

    describe('when asked to update a jukebox', function () {
        describe('and it is invalid', function () {
            it('should say bad request');
        });

        describe('and unknown failure occurs', function () {
            it('should say error');
        });

        describe('and it is valid', function () {
            it('should say ok');
        });
    });

    describe('when asked to delete a jukebox', function () {
        describe('and it exists', function () {
            it('should say ok');
        });

        describe('and none exist', function () {
            it('should say error');
        });
    });
});