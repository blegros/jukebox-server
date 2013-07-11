//Hook to integrate nodefly
if (process.env.NODE_ENV === 'production') {
    require('nodefly').profile(
        'cf31db9a-3150-4e63-a2fe-a8709903b657',
        ['open-jukebox-server', 'Heroku']
    );
}

var server = require('./app')();

// start server
server.listen(server.port, function () {
    console.log('Server listening on port ' + server.port);
});