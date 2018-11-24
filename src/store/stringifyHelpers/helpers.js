export const 

appendCursorsToQuery = (string, store) => {
        // console.log(store);
        const cursors = store.query.cursors;
        Object.keys(cursors).forEach(cursor => {
            string += cursors[cursor].cursorLeft;
            if (cursors[cursor].value && cursors[cursor].fieldValue) {
                string += cursors[cursor].fieldValue;
            }
            string += cursors[cursor].cursorRight;
        })
        return string;
    },

hasActiveFields = (stage) => {
    let bool = false;
    stage.actives
        .filter(activeField => activeField === true)
        .map((activeField) => {
            return bool = true;
        });
    return bool;
},

quotify = (string) => {
    return '"' + string + '"';
},

handlePreParamsType = (stageIter, queryName,store) => {
    let preParams = '';
    if (queryName) {
        let collectionPreStage = store.queryCollectionState[stageIter].preStage;
        let preStage = collectionPreStage ? collectionPreStage : queryName.preParams;
        preParams = (queryName && queryName.preParamsInput === 'text' ? queryName.preParamsLeft + preStage + queryName.preParamsRight :
            queryName && queryName.preParamsInput === 'select' ? queryName.preParamsLeft + preStage + queryName.preParamsRight : queryName.preParams);
    }

    return preParams;
},

handlePostParamsType = (stageIter, queryName,store) => {
    let postParams = '';
    if (queryName) {
        postParams = (queryName && queryName.postParamsInput === 'text' ? queryName.postParamsLeft + store.queryCollectionState[stageIter].postStage + queryName.postParamsRight :
            queryName && queryName.postParamsInput === 'select' ? queryName.postParamsLeft + store.queryCollectionState[stageIter].postStage + queryName.postParamsRight : queryName.postParams);
    }
    return postParams;
},

getSetValueTypesFromConfig = (type, stage,store) => {
    //console.log(type);
    const valueType = (type ? store.config.stringTypes[type] : {
        "left": "\"",
        "right": "\""
    });
    let query = store.query;
    query.stages[stage].valueTypeLeft = valueType.left;
    query.stages[stage].valueTypeRight = valueType.right;
    // this.props.setQueryValuesToStore(query);
    return valueType;
},

getOperatorParamsFromConfig = (op,store) => {
    // console.log(op);
    const opSyn = store.config.operators[op];
    return opSyn;
},


sanitizeQueryString = (string) => {
    //DO NOT DELETE COMMENTED (Stage wasn't updating thats why its commented)
    // string = (string.match(/^\{((?!\w).)*\}$/) ? string.replace(/^\{((?!\w).)*\}$/g, '') : string);
    string = (string.match(/\s$/) ? string.replace(/\s$/g, '') : string);
    string = (string.match(/,$/) ? string.replace(/,$/g, '') : string);
    string = (string.match(/,\s,\s/) ? string.replace(/,\s,\s/, ', ') : string);
    // string = (string.match(/^((?!\w).)*$/) ? '' : string);
    return string;
},

dbAndCollection = (collection,store) => {
    const string = (collection ? "db." + collection : "db." + store.query.collection);
    return (string);
}
