import constants from '../constants';

const mapStateToProps = (state) => {
    return {
        savedConnections: state.user.savedConnections ? state.user.savedConnections : {},
        storeUser: state.user,
        storeConnection: state.connection
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
