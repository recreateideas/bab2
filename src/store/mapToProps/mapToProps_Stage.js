import constants from '../constants';

const mapStateToProps = (state) => {
    return {
        storeQuery: state.query,
        storeConfig: state.config,
        storeQueryType: state.query.queryType,
        storeQueryCollectionState: state.queryCollectionState,
        _paramsLine: {
            actives: [true],
            keys: [''],
            operators: [Object.keys(state.config.operators)[0]],
            types: [Object.keys(state.config.stringTypes)[0]],
            values: ['']
        },
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setQueryCollectionStateToStore: (collectionState) => {
            const action = {
                type: constants.SET_QUERY_COLLECTION_STATE,
                collectionState: collectionState
            }
            dispatch(action)
            dispatch(updateQuery())
            function updateQuery() {
                return (dispatch, getState) => {
                    const state = getState();
                    dispatch({
                        type: constants.UPDATE_MONGO_QUERY,
                        state,
                    })
                }
            }
        }
    }
}

export { mapStateToProps, mapDispatchToProps };
