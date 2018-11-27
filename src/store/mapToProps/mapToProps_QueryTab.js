import constants from '../constants';

const mapStateToProps = (state) => {
    return {
        storeQueryMessage: state.mongo.queryMessage,
        storeQueryError: state.mongo.queryError,
        storeConfig: state.config,
        storeQueryType: state.query.queryType,
        storeQuery: state.query,
        storeQueryCollectionState: state.queryCollectionState,
        storeConnectionName: state.connection.label,
        _collectionStateTemplate: {
            isActive : true,
            preStage : '',
            params: {
                actives: [true],
                keys: [''],
                operators: [Object.keys(state.config.operators)[0]],
                types: [Object.keys(state.config.stringTypes)[0]],
                values: ['']
            }
        },
        _stageTemplate: {
            valueTypeLeft : '"',
            valueTypeRight :'"',
            isActive: true,
            preStage: '',
            params: {
                actives: [true],
                keys: [''],
                operators: [Object.keys(state.config.operators)[0]],
                types: [Object.keys(state.config.stringTypes)[0]],
                values: ['']
            }
        },
    }
}

const mapDispatchToProps = (dispatch) => {
    
    return {
        setConfigQueriesToStore: (queries) => {
            const action = {
                type: constants.SET_CONFIG_QUERIES,
                queries: queries
            }
            dispatch(action);
        },
        setQueryValuesToStore: (query) => {
            const action = {
                type: constants.SET_QUERY_VALUES,
                query: query
            }
            dispatch(action)
            dispatch(updateQuery())
            function updateQuery(){
                return (dispatch, getState)=>{
                    const state = getState();
                    dispatch({
                        type: constants.UPDATE_MONGO_QUERY,
                        state,
                    })
                }
            }
        },
        setQueryCollectionStateToStore: (collectionState) => {
            const action = {
                type: constants.SET_QUERY_COLLECTION_STATE,
                collectionState: collectionState
            }
            dispatch(action)
            dispatch(updateQuery())
            function updateQuery(){
                return (dispatch, getState)=>{
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

export { mapStateToProps, mapDispatchToProps};
