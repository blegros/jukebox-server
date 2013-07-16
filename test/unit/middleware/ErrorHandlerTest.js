var assertions = require('../../assertions')(),
    should = assertions.chai.should(),
    sinon = assertions.sinon;

describe('Given middleware for unhandled exceptions', function () {
    var express = null,
        errorHandler = null,
        success = function() { return 'success'; };

    beforeEach(function () {
        express = { errorHandler: function() {} };
        errorHandler = sinon.stub(express, 'errorHandler');
    });

    describe('when the environment is development or test', function () {
        it('should use the a verbose error handle', function () {
            errorHandler.withArgs({ dumpExceptions: true, showStack: true }).returns(success);

            var errorHandlerDev = require('../../../lib/middleware/ErrorHandler')('development', express);
            errorHandlerDev.should.exist;
            errorHandlerDev().should.equal('success');

            var errorHandlerTest = require('../../../lib/middleware/ErrorHandler')('test', express);
            errorHandlerTest.should.exist;
            errorHandlerTest().should.equal('success');
        });
    });

    describe('when the environment production', function () {
        it('should use a concise error handler', function () {
            errorHandler.withArgs().returns(success);

            console.log(process.cwd());

            var errorHandlerProd = require('../../../lib/middleware/ErrorHandler')('production', express);
            errorHandlerProd.should.exist;
            errorHandlerProd().should.equal('success');
        });
    });

    describe('when the environment is not found', function () {
        it('should throw an error', function () {
            try {
                require('../../../lib/middleware/ErrorHandler')('blah');
            }
            catch (e) {
                e.should.have.property('message').that.contain('blah');
            }
        });
    });
});