var config = require('./lib/config/default.json'),
    server = require('./app')(config),
    port = server.app.get('port');

// start server
server.listen(port, function () {
    console.log('Server listening on port ' + port);
});