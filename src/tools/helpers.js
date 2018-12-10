

const isNotEmptyArray = array => array && Array.isArray(array) && Object.keys(array).length > 0 ;

const formatUglyJSON = json => {
    if (json && json !== []) {
        let html = JSON.stringify(json);
        html = html.replace(/("|{"|,")([^"]+)(":)/gm, `$1<span class='json-key'>$2</span>$3`);
        html = html.replace(/(:|\[)(")([^"]+)(")/gm, `$1<span class='json-string'>$2$3$4</span>`);
        html = html.replace(/(\[)(")([^"]+)(")(,|\]|,")/gm, `$1<span class='json-string'>$2$3$4</span>$5`);
        html = html.replace(/(,)(")([^"]+)(")(,|\])/gm, `$1<span class='json-string'>$2$3$4</span>$5`);
        html = html.replace(/(,|:\[|:{|:)(\d+)(,|\]|})/gm, `$1<span class='json-value'>$2</span>$3`);//
        html = html.replace(/(,|:\[|:{|:)(\d+)(])/gm, `$1<span class='json-value'>$2</span>$3`);
        return html;
    }
    else return '';
}

export { isNotEmptyArray, formatUglyJSON }
