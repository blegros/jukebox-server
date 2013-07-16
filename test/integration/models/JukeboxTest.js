//TODO: Get tests running in debugger
//TODO: Get fixtures into MongoDB

var assertions = require('../../assertions')(),
    should = assertions.chai.should(),
    sinon = assertions.sinon,
    geocoder = { geocode: function() {} },
    helper = require('../testHelper')(),
    Jukebox = require('../../../lib/models/Jukebox')(helper.config, helper.mongoose, geocoder),
    fixtures = require('../../fixtures/Jukebox.json');

describe('Given a Jukebox', function () {
    before(function (done) {
        helper.connect(done);
    });

    after(function (done) {
        helper.disconnect(done);
    });

    describe('when being validated', function () {
        var jukebox = new Jukebox(fixtures.simple);

        it('should be valid with simple fixture', function (done) {
            jukebox.validate(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be invalid with master volume below 0', function (done) {
            jukebox.masterVolumeLevel = -1;

            jukebox.validate(function (err) {
                should.exist(err);
                err.should.have.property('name').equal('ValidationError');
                err.should.have.property('errors').with.property('masterVolumeLevel');
                done();
            });
        });

        it('should be invalid with master volume level exceeding 1', function (done) {
            jukebox.masterVolumeLevel = 2;

            jukebox.validate(function (err) {
                should.exist(err);
                err.should.have.property('name').equal('ValidationError');
                err.should.have.property('errors').with.property('masterVolumeLevel');
                done();
            });
        });

        it('should be invalid with no name');
        it('should be invalid with no address');
        it('should be invalid with no location');
    });

    describe('when encoding and verifying password', function () {
        var password = 'abcd1234';

        it('should produce a consistent encoding for the same password');
        it('should produce a different encoding when using two different passwords');
        it('should be able to verify an encoded password');
    });

    describe('when encoding and verifying clientPassword', function () {
        var password = 'zyxw0987';

        it('should produce a consistent encoding for the same clientPassword');
        it('should produce a different encoding when using two different clientPasswords');
        it('should be able to verify an encoded password');
    });

    describe('when being created', function () {
        describe('with a password and clientPassword', function () {
            it('should encrypt the password');
            it('should encrypt the clientPassword');
        });

        describe('without a password and clientPassword', function () {
            it('should not add a password if none is provided');
            it('should not add a clientPassword if none is provided');
        });

        it('should geocode the address into a location');
        it('should replace the address with the matching geocoded address');
        it('should persist the instance');
    });

    describe('when being updated', function () {
        it('should allow name to change');
        it('should allow masterVolumeLevel to change');
        it('should allow maxQueuesPerClient to change');
        it('should allow maxQueueLength to change');
        it('should allow crossFadeTracks to change');
        it('should allow password to change and be re-encoded');
        it('should allow clientPassword to change and be re-encoded');
        it('should not allow address to change');
        it('should not allow location to change');
        it('should not allow now_playing to change');
        it('should not allow clients to change');
        it('should be persisted');
    });

    describe('when a track is played', function () {
        it('should be updated on the jukebox');
        it('should be persisted');
    });

    describe('when a track is done playing', function () {
        it('should be removed from the jukebox');
        it('should be persisted');
    });
});

describe('Given you want to find a Jukebox', function () {
    before(function (done) {
        helper.connect(done);
    });

    after(function (done) {
        helper.disconnect(done);
    });

    describe('when a location and range are available', function () {
        it('should only return results within the range');
        it('should not have a result outside of the range');
    });
});