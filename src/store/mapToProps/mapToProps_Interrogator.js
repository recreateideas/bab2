import constants from '../constants';

const mapStateToProps = (state) => { // use this also to select what propsApp should listen to to rerender
    // console.log('@@ APP -> mapStateToProps');
    return {
        // storeResults: state.Resultsmongo_results,
        storeQueryParams: state.query,
        storeDBConnected: state.connection.isDBConnected,
        storeMongoObject: state.mongo.mongo_object,
        storeCollection: state.query.collection,
        storeQueryType: state.query.queryType,
        storeDB: state.connection.db
    }
}

const mapDispatchToProps = (dispatch) => {

    return {
        setResultsToStore: (results) => {
            const action = {
                type: constants.SET_RESULTS,
                queryResults: results
            }
            dispatch(action);
        },
        setQueryMessageToStore: (messageType,message) => {
            const action = {
                type: constants.SET_QUERYMESSAGE,
                messageType: messageType,
                queryMessage: message
            }
            dispatch(action);
        },
        setDisplayLoaderToStore: (loader,display) => {
            const action = {
                type: constants.DISPLAY_QUERY_LOADER,
                loader,
                display,
            }
            dispatch(action);
        },
    }
}

export { mapStateToProps, mapDispatchToProps};
