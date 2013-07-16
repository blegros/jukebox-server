var assertions = require('../../assertions')(),
    should = assertions.chai.should(),
    helper = require('../testHelper')(),
    Track = require('../../../lib/models/Track')(helper.config, helper.mongoose),
    fixtures = require('../../fixtures/Track.json');

describe('Given a Track', function () {
    before(function (done) {
        helper.connect(done);
    });

    after(function (done) {
        helper.disconnect(done);
    });

    describe('when it is being created', function () {
        it('should belong to a jukebox');
        it('should be persisted');
    });

    describe('when it is asked if it is being played', function () {
        it('should say it is when the jukebox is playing it');
        it('should say it is not when the jukebox is not playing it');
    });

    describe('when it is played', function () {
        it('should update the jukebox to play it');
        it('should record when it was played');
        it('should be persisted');
    });

    describe('when it is done playing', function () {
        it('should update the jukebox that it is done');
    });

    describe('when it is asked if it can be voted upon', function () {
        it('should say if the track is being played');
    });

    describe('when it is being voted upon', function () {
        it('should not allow tracks which cannot be voted upon');

        describe('and it is voted up', function () {
            it('should show 1 more like');
        });

        describe('and it is voted down', function () {
            it('should show 1 more dislike');
        });
    });
});

describe('Given you want to find Tracks associated with a Jukebox', function () {
    before(function (done) {
        helper.connect(done);
    });

    after(function (done) {
        helper.disconnect(done);
    });

    describe('when looking for recently played tracks', function() {
        it('should show at most 25 results');
        it('should show results which have been played');
        it('should show the results ordered desc by play timestamp');
    });

    describe('when looking for un-played tracks', function() {
        it('should show all un-played tracks');
        it('should show results which have not been played');
        it('should show the results ordered asc by the queue timestamp');
    });

    describe('when looking for the next track to play', function() {
        it('should show a single result');
        it('should show a result which has not been played');
        it('should be the oldest un-played track');
    });
});

