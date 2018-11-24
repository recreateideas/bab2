import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { config, connection, queryCollectionState, query, user, mongo, share, graphic } from './reducers';



/** STORE */
const allReducers = combineReducers({
    config,
    connection,
    queryCollectionState,
    query,
    user,
    mongo,
    share,
    graphic
});

const store = createStore(allReducers, compose(applyMiddleware(thunk)
/*remove those when going to production-->*/ 
,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));


    /**    add this to index.html when going to production <script>
         window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () { }
        </script> */

 export default store;
