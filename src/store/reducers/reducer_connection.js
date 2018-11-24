import constants from '../constants';
import initialState from '../initialState';

const connection = (state = initialState.connection, action) => {
    const obj = Object.assign({}, state);
    switch (action.type) {
        case constants.SET_ISCONNECTED:
            return Object.assign({}, state, { ...state, isDBConnected: action.isDBConnected });
        case constants.SET_CONNECTION_PARAMS:
            return Object.assign({}, state, { ...state, [action.param]: action.value });
        case constants.SET_CONNECTION_OBJECT:
            return Object.assign({}, state, action.connection );
            // return Object.assign({}, state, { connection: { ...state.connection, [action.param]: action.value } });
        default:
            return Object.assign({}, state, obj);
    }
}

export default connection;
