import constants from '../constants';

const mapStateToProps = (state) => { // use this also to select what propsApp should listen to to rerender
    // console.log('@@ APP -> mapStateToProps');
    return {
        storeAllState: state,
        storeQueryResults: state.mongo.mongo_results,
    }
}

const mapDispatchToProps = (dispatch) => {
    // console.log('@@ TOOL -> applyLoadedStateQueryToStore');
    return {
        applyLoadedStateQueryToStore: (result) => {
            console.log(result);
            console.log(JSON.parse(result));
            const loadedContent = JSON.parse(result);
            console.log(loadedContent);
            const apply_config = {
                type: constants.SET_CONFIG_OBJECT,
                config: loadedContent.config
            }
            const apply_connection = {
                type: constants.SET_CONNECTION_OBJECT,
                connection: loadedContent.connection
            }
            const apply_mongo = {
                type: constants.SET_MONGO_OBJECT,
                mongo: loadedContent.mongo
            }
            const apply_query = {
                type: constants.SET_QUERY_VALUES,
                query: loadedContent.query
            }
            const apply_queryCollectionState = {
                type: constants.SET_QUERY_COLLECTION_STATE,
                collectionState: loadedContent.queryCollectionState
            }
            dispatch(apply_config)
            dispatch(apply_connection)
            dispatch(apply_mongo)
            dispatch(apply_query)
            dispatch(apply_queryCollectionState)
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

export { mapStateToProps, mapDispatchToProps };
