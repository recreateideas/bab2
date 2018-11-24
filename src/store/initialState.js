//const  configJSON = require('../config.json');

const initialState = {
    config: require('../configuration/config.json'),
    connection: {
        isDBConnected: false,
        connectionStatus: 'Disconnected',
        remoteHostName: 'localhost',
        remoteMongoPort: '27017',
        remoteMongoInstance: 'mongodb',
        db: 'test',
        sshConnection: false,
        sshPath: '',
        sshMode: 'file'
    },
    queryCollectionState: {
        stage_1: {
            isActive: true,
            preStage: '',
            params: {
                actives: [],
                keys: [],
                operators: [],
                types: [],
                values: []
            }
        }
    },
    query: {
        collection: '',
        queryType: 'find',
        openQuery: '.find(',
        stages: {
            stage_1: {
                preParams: '',
                params: '',
                postParams: ''
            }
        },
        closeQuery: ')',
        cursors: {}
    },
    user:{
        loggedIn: false,
        customId:'',
        loginEmail:'',
        loginPassword:'',
        nickname: '',
        registerEmail:'',
        passWord:'',
        confirmPassWord:'',
    },
    mongo:{
        DBcollections: [],
        mongo_query: '',
        mongo_object: '',
        mongo_results: [],
    },
    share:{
        allUsers:[],
        activeUsers:[],
        chats:[],
        activeChatId:'',
        chatRooms:[],
        receiver:{
            customId: '',
            nickname: '',
            typing: false,
        }
    },
    graphic:{
        loaders: {},
    }
}

export default initialState;
