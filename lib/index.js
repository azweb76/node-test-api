var mongoose = require('mongoose');
var app = require('./app');
var profileMonitor = require('./profileMonitor');

function start(opts){
    var host = opts.host || 'localhost';
    var db = opts.database || 'test';

    mongoose.connect('mongodb://' + host + '/' + db);
    app.listen();
    profileMonitor.start({ unlockProfileMs: opts.unlockProfileMs || 600000 });
}

module.exports = {
    start: start
};

