import constants from '../constants';
import initialState from '../initialState';

const queryCollectionState = (state = initialState.queryCollectionState, action) => {
    const obj = Object.assign({}, state);
    switch (action.type) {
        case constants.SET_QUERY_COLLECTION_STATE:
            return Object.assign({}, state, action.collectionState);
        default:
            return Object.assign({}, state, obj);
    }
}

export default queryCollectionState;
