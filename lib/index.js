var mongoose = require('mongoose');
var app = require('./app');
var profileMonitor = require('./profileMonitor');
var server;

function start(opts){
    var host = opts.host || 'localhost';
    var db = opts.database || 'test';
    var port = opts.port || 3000;

    mongoose.connect('mongodb://' + host + '/' + db);
    server = app.listen(port);
    profileMonitor.start({ unlockProfileMs: opts.unlockProfileMs || 600000 });
}

function stop() {
    if(!server) server.stop();
}

module.exports = {
    start: start,
    stop: stop
};

