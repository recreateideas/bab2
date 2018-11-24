

const OBJtoCSVConverter = args => {
    let data, header = [], values = [];
    data = args || null;
    if (data == null || !data.length) {
        return null;
    }
    data.forEach((obj,index) => {
        values[index] = [];
        buildCSVData(obj, null, header, values[index], null)
    });
    let content = createCSVFileContent(header, values);
    console.log(content);
    return content;
}

const createCSVFileContent = (header, values) => {
    let result = '', rowData;
    result += `${header.join()}\n`;
    // console.log(header);
    // console.log(values);
    values.forEach(keyValuePair => {
        rowData = new Array(header.length);
        keyValuePair.forEach(({key, value})=>{
            rowData.splice(header.indexOf(key), 1, value);
        });
        // console.log(rowData);
        result += `${rowData.join()}\n`;
    });
    return result;
};

const buildCSVData = (obj, objKey, keysArray, valuesArray, index) => {
    let include = true;
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
            let keyLabel = objKey ? `${objKey}:${key}` : key;
            if (typeof index === 'number') keyLabel = `${keyLabel}:${index}`;
            if (keysArray && keysArray.indexOf(keyLabel) === -1) keysArray.push(keyLabel);
            addPairToArray(valuesArray, keyLabel, obj[key]);
        }
        else if (Array.isArray(obj[key])) {
            let keyLabel = objKey ? `${objKey}:${key}` : key;
            let value = '';
            obj[key].forEach((element, i) => {        
                if (typeof element === 'object') {
                    buildCSVData(element, keyLabel, keysArray, valuesArray, i);
                    include = false;
                }
                else {
                    value += `|${element}|`;
                }
            });
            if (include) {
                if (keysArray && keysArray.indexOf(keyLabel) === -1) keysArray.push(keyLabel);
                addPairToArray(valuesArray, keyLabel, value);
            }      
        }
        else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            buildCSVData(obj[key], key, keysArray, valuesArray, null);
        }
    });
}

const addPairToArray = (array, key, value) => {
    let keyValueObject = {key,value};
    array.push(keyValueObject);
} 



export default OBJtoCSVConverter;
