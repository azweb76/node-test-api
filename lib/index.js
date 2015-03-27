var mongoose = require('mongoose');
var app = require('./app');

function start(opts){
    var host = opts.host || 'localhost';
    var db = opts.database || 'test';

    mongoose.connect('mongodb://' + host + '/' + db);
}

module.exports = {
    start: start
};

