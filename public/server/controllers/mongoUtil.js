'use strict';

var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    Server = mongodb.Server,
    fs = require('fs'),
    exec = require("child_process").exec;
// assert = require('assert');
// http = require('http'),
// httpProxy = require('http-proxy'),
// url = require('url');

var _remoteMongoInstance = void 0,
    _db = void 0,
    _dbName = void 0,
    _mongoClient = void 0,
    _mongoPassword = void 0,
    _mongoUser = void 0,
    _mongoPort = void 0,
    _hostName = void 0;

module.exports = {

    connectToDB: function connectToDB(params, callback) {
        try {
            _dbName = params.connection.db;
            _hostName = params.connection.remoteHostName;
            _mongoPort = params.connection.remoteMongoPort;
            _mongoUser = params.connection.remoteMongoUser ? params.connection.remoteMongoUser + ':' : '';
            _mongoPassword = params.connection.remoteUserPassword ? params.connection.remoteUserPassword + '@' : '';
            _remoteMongoInstance = params.connection.remoteMongoInstance;
            var mongoUrl = _remoteMongoInstance + '://' + _mongoUser + _mongoPassword + _hostName + ':' + _mongoPort + '/' + _dbName;
            var options = {
                auto_reconnect: false,
                ssl: false
                // SSH ??
                // sslPass: 'Oidualc2.',
                // sslKey: key,
            };
            var server = new Server(_hostName, _mongoPort, options);
            mongoConnect(server, mongoUrl, callback);
        } catch (err) {
            console.log(err);
            callback(err);
        }
    },

    getClient: function getClient() {
        return _mongoClient;
    },

    getDB: function getDB() {
        return _db;
    },

    getMongoPort: function getMongoPort() {
        return _mongoPort;
    },

    getHostName: function getHostName() {
        return _hostName;
    },

    getDBName: function getDBName() {
        return _dbName;
    }
};

var mongoConnect = function mongoConnect(server, mongoUrl, callback) {
    try {
        _mongoClient = MongoClient;
        _mongoClient.connect(mongoUrl, { useNewUrlParser: true }, function (err, client) {
            if (client) {
                _db = client.db(_dbName);
                _mongoClient = client;
                console.log('Connected to db...' + mongoUrl);
            }
            if (err) console.log(err);
            return callback(err);
        });
    } catch (err) {
        console.log(err);
    }
};