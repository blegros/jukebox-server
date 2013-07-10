var server = require('../../app.js')(),
    app = server.app;

//Add functional testing hooks
server.use = function() {
    app.use.apply(app, arguments);
};

//export patched server
module.exports = server;