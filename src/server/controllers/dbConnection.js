const mongoUtil = require('./mongoUtil');

let mongoClient, db;

const dbConnection = (req, res) => {
    try {
        const params = req.body.params;
        console.log(req);
        if (!params.connection.db) {
            return res.json({
                status: 'Error',
                message: `No DB specified`,
                warning: '',
                Collections: [],
                isConnected: false
            });
        } else {
            // console.log(params);
            mongoClient = mongoUtil.connectToDB(params, (err) => {
                if (err) {
                    return res.json({
                        status: 'Error',
                        message: `Server Error: ${err}.`,
                        warning: '',
                        Collections: [],
                        isConnected: false
                    });
                } else {
                    db = mongoUtil.getDB();
                    const hostName = mongoUtil.getHostName();
                    const mongoPort = mongoUtil.getMongoPort();
                    const dbName = mongoUtil.getDBName();
                    db.listCollections().toArray((err, collections) => {
                        // console.log(collections);
                        if (collections && collections.length > 0) {
                            return res.json({
                                status: 'Success',
                                message: `Successfully connected to DB '${dbName}' on ${hostName}:${mongoPort}.`,
                                warning: '',
                                Collections: collections,
                                isConnected: true
                            })
                        }
                        else {
                            return res.json({
                                status: 'Success',
                                message: ` Successfully connected to '${dbName}' on ${hostName}:${mongoPort}\n`,
                                warning: `Warning: DB '${dbName}' seems to be empty.`,
                                Collections: collections,
                                isConnected: true
                            });
                        }

                    })
                }
            });
        }
    } catch (err) {
        return res.json({
            status: 'Error',
            message: `Server Error: ${err}.`,
            warning: '',
            Collections: [],
            isConnected: false
        })
    }
};

const dbClose = (res) => {
    mongoClient = mongoUtil.getClient();
    mongoClient.close();
    console.log('closing connection to MongoDB...');
    mongoClient.close(() => {
        console.log('MongoDB connection closed');
        return res.json({
            status: 'Disconnected',
            message: 'DB disconnected',
            isConnected: false
        })
    })
}

exports.handleConnection = (req, res) => {
    // console.log(req);
    const connectionType = req.body.connectionType;
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
