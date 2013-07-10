module.exports = function (environment) {
    var config = null;

    console.log("Found " + environment + " environment.");

    switch (environment) {
        case 'development':
            config = require('./dev.json');
            break;
        case 'test':
            config = require('./test.json');
            break;
        case 'production':
            config = require('./production.json');
            break;
        default:
            throw new Error('Could not locate configuration file for [' + environment + "]!");
    }

    return config;
};