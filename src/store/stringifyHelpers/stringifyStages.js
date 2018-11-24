
import {
    hasActiveFields, handlePreParamsType, getOperatorParamsFromConfig,
    sanitizeQueryString, dbAndCollection, appendCursorsToQuery,
    getSetValueTypesFromConfig, quotify, handlePostParamsType
} from './helpers';

const QUERY = (store) => {

    const stringifyStages = (store) => {
        const collection = store.queryCollectionState;
        let stageCount = 0, string = '', subString = '';// mongoQuery='';
        let query = store.query;
        Object.keys(collection)
            .filter(stageName => store.query.stages.hasOwnProperty(stageName))
            .forEach(stageName => {
                let currentStage = collection[stageName];
                let pairCount = 0;
                if (currentStage.isActive === true && currentStage.params.actives && hasActiveFields(currentStage.params)) { //if it's active it  builds a string
                    const queryName = query.stages[stageName];
                    subString += handlePreParamsType(stageName, queryName, store) + '{'; //'selects' the active lines in the stageName belonging to queryCollectionState               
                    currentStage.params.actives.forEach((active, index) => {
                        if (active === true) {
                            const key = currentStage.params.keys[index];
                            const op = currentStage.params.operators[index];
                            const opSyn = getOperatorParamsFromConfig(op, store);
                            const valueType = getSetValueTypesFromConfig(currentStage.params.types[index], stageName, store);
                            const val = currentStage.params.values[index];
                            subString += (pairCount > 0 ? ', ' : ''); //separates the key value pairs
                            subString += quotify(key) + opSyn.pre + op + opSyn.left + valueType.left + val + valueType.right + opSyn.right;
                            pairCount++;
                        }
                    })
                    subString += handlePostParamsType(stageName, queryName, store) + '}';
                    query.stages[stageName].params = subString;
                    string += stageCount > 0 ? ', ' : ''; //separates the stages
                    string += subString;
                    subString = '';
                    stageCount++;
                }
            })
        console.log(`Query string: ${string}`);
        const paramsObj = sanitizeQueryString(string);
        string = dbAndCollection(null, store) + query.openQuery + string + query.closeQuery;
        string = appendCursorsToQuery(string, store);
        return {
            string: sanitizeQueryString(string),
            paramsObj: paramsObj
        }
    }

    return stringifyStages(store)

}


export default QUERY;
