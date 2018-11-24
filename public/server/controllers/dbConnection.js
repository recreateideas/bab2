'use strict';

var mongoUtil = require('./mongoUtil');

var mongoClient = void 0,
    db = void 0;

var dbConnection = function dbConnection(req, res) {
    try {
        var params = req.body.params;
        console.log(req);
        if (!params.connection.db) {
            return res.json({
                status: 'Error',
                message: 'No DB specified',
                warning: '',
                Collections: [],
                isConnected: false
            });
        } else {
            // console.log(params);
            mongoClient = mongoUtil.connectToDB(params, function (err) {
                if (err) {
                    return res.json({
                        status: 'Error',
                        message: 'Server Error: ' + err + '.',
                        warning: '',
                        Collections: [],
                        isConnected: false
                    });
                } else {
                    db = mongoUtil.getDB();
                    var hostName = mongoUtil.getHostName();
                    var mongoPort = mongoUtil.getMongoPort();
                    var dbName = mongoUtil.getDBName();
                    db.listCollections().toArray(function (err, collections) {
                        // console.log(collections);
                        if (collections && collections.length > 0) {
                            return res.json({
                                status: 'Success',
                                message: 'Successfully connected to DB \'' + dbName + '\' on ' + hostName + ':' + mongoPort + '.',
                                warning: '',
                                Collections: collections,
                                isConnected: true
                            });
                        } else {
                            return res.json({
                                status: 'Success',
                                message: ' Successfully connected to \'' + dbName + '\' on ' + hostName + ':' + mongoPort + '\n',
                                warning: 'Warning: DB \'' + dbName + '\' seems to be empty.',
                                Collections: collections,
                                isConnected: true
                            });
                        }
                    });
                }
            });
        }
    } catch (err) {
        return res.json({
            status: 'Error',
            message: 'Server Error: ' + err + '.',
            warning: '',
            Collections: [],
            isConnected: false
        });
    }
};

var dbClose = function dbClose(res) {
    mongoClient = mongoUtil.getClient();
    mongoClient.close();
    console.log('closing connection to MongoDB...');
    mongoClient.close(function () {
        console.log('MongoDB connection closed');
        return res.json({
            status: 'Disconnected',
            message: 'DB disconnected',
            isConnected: false
        });
    });
};

exports.handleConnection = function (req, res) {
    // console.log(req);
    var connectionType = req.body.connectionType;
    switch (connectionType) {
        case 'connect':
            console.log('connect');
            dbConnection(req, res);
            break;
        case 'disconnect':
            dbClose(res);
            break;
        default:
            break;
    }
};