var express = require('express');
var routes  = require('./routes');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes.register(app);

function listen(port){
    var server = app.listen(port, function () {

        var host = server.address().address
        var port = server.address().port

        console.log('Example app listening at http://%s:%s', host, port);
    });
    return server;
}

module.exports = {
    listen: listen
};