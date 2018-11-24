
const getElementsFromConfig = (config, elements) =>{
    const nodes = config[elements];
    let array = [];
    for (let type in nodes) {
        array.push(type);
    }
    //console.log(array);
    return array;
};


const findStageValuesFromConfig = (config, stage) => {
    let valueArray = (stage.preParamsInput && stage.preParamsInput === 'select' ? config.selectValues[stage.preParamsValues] : null);
    return valueArray;
};


const parsePreParamsSyntax = (config) => {
    // console.log('APP -> parsePreParamsSyntax');
    const queries = config.queries;
    for (let type in queries) {
        let localType = queries[type];
        for (let stageVar in localType.stages) {
            let stage = localType.stages[stageVar];
            stage.preParamsLeft = (stage.preParams ? stage.preParams.split('_preParamsValue_')[0] : '');
            stage.preParamsRight = (stage.preParams ? stage.preParams.split('_preParamsValue_')[1] : '');
            const valueRangeName = stage.preParamsValues;
            switch (stage.preParamsInput) {
                case 'select':
                    stage.preParams = config.selectValues[valueRangeName][0];
                    break;
                default:
                    stage.preParams = '';
                    break;
            }
            localType.stages[stageVar] = stage;
        }
        queries[type] = localType;
    }
    return queries;
};

export { getElementsFromConfig, findStageValuesFromConfig, parsePreParamsSyntax };
