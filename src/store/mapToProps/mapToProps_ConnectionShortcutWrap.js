import constants from '../constants';

const mapStateToProps = (state) => {
    const customId = state.user.customId;
    return {
        savedConnections: state.user.savedConnections ? state.user.savedConnections : {},
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
    }
}

export { mapStateToProps, mapDispatchToProps };
