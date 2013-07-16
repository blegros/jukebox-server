module.exports = function (environment, express) {
    "use strict";

    var errorHandler = null;
    express = express || require('express');

    switch (environment) {
        case 'development':
        case 'test':
            errorHandler = express.errorHandler({ dumpExceptions: true, showStack: true });
            break;
        case 'production':
            errorHandler = express.errorHandler();
            break;
        default:
            throw new Error("Could not locate error handler for [" + environment + "]!");
    }

    return errorHandler;
};