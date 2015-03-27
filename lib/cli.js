#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));

if(argv.config){
    argv = require(argv.config);
}

var idx = require('./');
idx.start(argv);