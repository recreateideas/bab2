'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var _require = require('celebrate'),
    errors = _require.errors;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app);

app.use(errors());
app.listen('5001');

console.log('Listening on localhost, port: 5001');