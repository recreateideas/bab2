import constants from '../constants';
import initialState from '../initialState';
import QUERY from '../stringifyHelpers/stringifyStages';

const mongo = (mongo = initialState.mongo, action) => {
    const obj = Object.assign({}, mongo);
    switch (action.type) {
        case constants.SET_DBCOLLECTIONS:
            return Object.assign({}, mongo, { ...mongo, DBcollections: action.DBcollections } );
        case constants.SET_RESULTS:
            return Object.assign({}, mongo, { ...mongo, mongo_results: action.queryResults } );
        case constants.SET_QUERYMESSAGE:
            return Object.assign({}, mongo, { ...mongo, [action.messageType]: action.queryMessage } );
        case constants.UPDATE_MONGO_QUERY:
            let Query = QUERY(action.state);
            return Object.assign({}, mongo, { ...mongo, mongo_query: Query.string, mongo_object: Query.paramsObj } );
        case constants.SET_MONGO_OBJECT:
            return Object.assign({}, mongo, action.mongo );

        default:
            return Object.assign({}, mongo, obj);
    }
}

export default mongo;
