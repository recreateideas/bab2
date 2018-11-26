import constants from '../constants';

const mapStateToProps = (state) => {
    return {
        savedConnections: state.user.savedConnections ? state.user.savedConnections : {},
        storeUser: state.user,
        storeConnection: state.connection,
        _connection: {
            isDBConnected: false,
            connectionStatus: 'Disconnected',
            remoteHostName: '',
            remoteMongoPort: '27017',
            remoteMongoInstance: 'mongodb',
            db: '',
            label: '',
            sshConnection: false,
            sshPath: '',
            sshMode: 'file'
        },
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAllConnectionParametersToStore: (params) => {
            const action = {
                type: constants.SET_ALL_CONNECTION_PARAMS,
                params,
            }
            dispatch(action)
        },
        setSavedConnectionsToStore: (savedConnectionsCustomId) => {
            const action = {
                type: constants.SAVE_SAVED_CONNECTIONS,
                savedConnectionsCustomId,
            }
            dispatch(action);
        },
    }
}

export { mapStateToProps, mapDispatchToProps };
