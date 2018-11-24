const mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    Server = mongodb.Server,
    fs = require('fs'),
    exec = require("child_process").exec;
    // assert = require('assert');
// http = require('http'),
// httpProxy = require('http-proxy'),
// url = require('url');

let _remoteMongoInstance, _db, _dbName, _mongoClient, _mongoPassword, _mongoUser, _mongoPort, _hostName;

module.exports = {

    connectToDB: (params, callback) => {
        try {
            _dbName = params.connection.db;
            _hostName = params.connection.remoteHostName;
            _mongoPort = params.connection.remoteMongoPort;
            _mongoUser = params.connection.remoteMongoUser ? `${params.connection.remoteMongoUser}:` : '';
            _mongoPassword = params.connection.remoteUserPassword ? `${params.connection.remoteUserPassword}@` : '';
            _remoteMongoInstance = params.connection.remoteMongoInstance;
            const mongoUrl = `${_remoteMongoInstance}://${_mongoUser}${_mongoPassword}${_hostName}:${_mongoPort}/${_dbName}`;
            const options = {
                auto_reconnect: false,
                ssl: false,
                // SSH ??
                // sslPass: 'Oidualc2.',
                // sslKey: key,
            };
            const server = new Server(_hostName, _mongoPort, options)
            mongoConnect(server, mongoUrl, callback);
        } catch (err) {
            console.log(err);
            callback(err);
        }
    },

    getClient: () => {
        return _mongoClient;
    },

    getDB: () => {
        return _db;
    },

    getMongoPort: () => {
        return _mongoPort;
    },

    getHostName: () => {
        return _hostName;
    },

    getDBName: () => {
        return _dbName;
    }
};

const mongoConnect = (server, mongoUrl, callback) => {
    try {
        _mongoClient = MongoClient;
        _mongoClient.connect(mongoUrl,{ useNewUrlParser: true }, (err, client) => {
            if (client) {
                _db = client.db(_dbName);
                _mongoClient = client;
                console.log(`Connected to db...${mongoUrl}`);
            }
            if (err) console.log(err);
            return callback(err);
        });
    }
    catch (err) {
        console.log(err);
    }
};
