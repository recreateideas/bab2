import constants from '../constants';

const mapStateToProps = (state) => {
    const isPretty = state.query.cursors.hasOwnProperty('pretty')
    return {
        storeQuery: state.query,
        storeConfig: state.config,
        storeisPretty: isPretty,
        storeResults: state.mongo.mongo_results,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        insertCursorInQueryToStore: (cursors) => {
            const action = {
                type: constants.INSERT_CURSOR,
                cursors: cursors
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

export { mapStateToProps, mapDispatchToProps };
