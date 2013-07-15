module.exports = function () {
    "use strict";

    var express = require('express'),
        Resource = require('express-resource'),
        app = express(),
        http = require('http'),
        environment = app.get('env'),
        config = require('./lib/config')(environment),
        models = require('./lib/models')(config),
        controllers = require("./lib/controllers")(models),
        errorHandler = require('./lib/middleware/ErrorHandler')(environment);

    //configure middleware
    app.use(express.logger(config.logger.format));
    app.use(express.compress());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(errorHandler);

    //persist models and controllers to an application scope
    app.set('models', models);
    app.set('controllers', controllers);

    //setup routes
    require('./routes')(app, models, controllers);

    //create http server
    var server = http.createServer(app);
    server.port = process.env.PORT || config.port;

    //create reference to app for use in bootstrap if needed
    server.app = app;

    return server;
};
