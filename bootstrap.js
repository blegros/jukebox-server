var server = require('./app')();

// start server
server.listen(server.port, function () {
    console.log('Server listening on port ' + server.port);
});