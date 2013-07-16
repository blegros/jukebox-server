var assertions = require('../../assertions')(),
    should = assertions.chai.should(),
    sinon = assertions.sinon;

describe('Given the Tracks controller', function () {
    describe('when asked to load', function () {
        it('should load a track with its jukebox');
    });

    describe('when asked to show the currently playing track', function () {
        describe('and nothing is playing', function () {
            it('should say not found');
        });

        describe('and a track is playing', function () {
            it('should say ok');
        });
    });

    describe('when asked to show recently played tracks', function () {
        describe('and no tracks have been played', function () {
            it('should say not found');
        });

        describe('and tracks have been played', function () {
            it('should say ok');
        });
    });

    describe('when asked to show un-played tracks', function () {
        describe('and no tracks have been queued', function () {
            it('should say not found');
        });

        describe('and tracks have been queued', function () {
            it('should say ok');
        });
    });

    describe('when asked to queue a track', function () {
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

    describe('when asked to show a track', function () {
        it('should say ok');
    });

    describe('when asked to play a track', function () {
        describe('and it cannot be played', function () {
            it('should say error');
        });

        describe('and it can be played', function () {
            it('should say ok');
        });
    });

    describe('when asked to vote on a track', function () {
        describe('and a track cannot be voted on', function () {
            it('should say operation not supported');
        });

        describe('and a track can be voted on', function () {
            describe('and the vote is accepted', function () {
                it('should say ok');
            });
            describe('and the vote is rejected', function () {
                it('should say error');
            });
        });
    });

    describe('when asked to mark a track as done', function () {
        describe('and it cannot be marked', function () {
            it('should say error');
        });

        describe('and it can be marked', function () {
            it('should say ok');
        });
    });

    describe('when asked to show the next track', function () {
        describe('and there is an issue finding a track', function () {
            it('should say error');
        });

        describe('and no more tracks are queued', function () {
            it('should say not found');
        });

        describe('and the next track is available', function () {
            it('should say ok');
        });
    });

    describe('when asked to remove a track', function () {
        describe('and it has been played', function () {
            it('should say operation not supported');
        });

        describe('and it has not been played', function () {
            it('should say ok');
        });
    });
});