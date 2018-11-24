import constants from '../constants';
import initialState from '../initialState';

const query = (state = initialState.query, action) => {
    const obj = Object.assign({}, state);
    switch (action.type) {
        case constants.SET_COLLECTION:
            return Object.assign({}, state, { ...state, collection: action.collection  } );
        case constants.SET_QUERY_VALUES:
            return Object.assign({}, state, action.query );
        case constants.INSERT_CURSOR:
            return Object.assign({}, state, { ...state, cursors: Object.assign({}, action.cursors) } );       
        default:
            return Object.assign({}, state, obj);
    } 
}

export default query;
