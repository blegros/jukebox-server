module.exports = function () {
    "use strict";

    var chai = require('chai'),
        sinon = require('sinon'),
        sinonChai = require('sinon-chai');

    chai.use(sinonChai);

    return {
        chai: chai,
        sinon: sinon
    };
}