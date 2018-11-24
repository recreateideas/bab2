import constants from '../constants';
import initialState from '../initialState';

const config = (state = initialState.config, action) => {
    const obj = Object.assign({}, state);
    switch (action.type) {
        case constants.SET_CONFIG_QUERIES:
            obj.queries = Object.assign({}, action.queries);
            return Object.assign({}, state, obj);
        case constants.SET_CONFIG_OBJECT:
            return Object.assign({}, state, action.config);

        default:
            return Object.assign({}, state, obj);
    }
}

export default config;
