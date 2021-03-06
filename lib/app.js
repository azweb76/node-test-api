var express = require('express');
var routes  = require('./routes');
var bodyParser = require('body-parser');
var app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes.register(app);

function listen(){
    var server = app.listen(3000, function () {

        var host = server.address().address
        var port = server.address().port

        console.log('Example app listening at http://%s:%s', host, port);
    });
}

module.exports = {
    listen: listen
};