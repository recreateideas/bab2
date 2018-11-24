import constants from '../constants';
import initialState from '../initialState';

const graphic = (state = initialState.graphic, action) => {
    const obj = Object.assign({}, state);
    switch (action.type) {
        case constants.DISPLAY_QUERY_LOADER:
            // return Object.assign({}, state, { ...state, [action.loader]: action.display } );
            return Object.assign({}, state, { ...state, loaders: { ...state.loaders, [action.loader]: action.display }});

        default:
            return Object.assign({}, state, obj);
    }
}

export default graphic;
