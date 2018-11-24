'use strict';

var _require = require('./validators'),
    queryValidator = _require.queryValidator,
    connectionValidator = _require.connectionValidator;
// const {upload, moveFile} = require('./controllers/fileUpload');


var http = require('http'),
    httpProxy = require('http-proxy');

module.exports = function (app) {
    var query = require('./controllers/queryMethods');
    var database = require('./controllers/dbConnection');

    app.get('/mongo', query.findAll);

    app.post('/query', queryValidator, query.handleQueryExecution);

    app.post('/database/connection', /*connectionValidator,*/database.handleConnection);

    //add more!.. like delete('/mongo/:id',query.delete); 
};