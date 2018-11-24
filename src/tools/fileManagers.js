import OBJtoCSVConverter from './OBJtoCSVConverter';
import * as r from 'jsrsasign';
import 'regenerator-runtime';
import 'babel-polyfill';
// require('jsrsasign')[RSAKey];
// var r = require('jsrsasign-util');

    
const fileAPICheck = (component)=> {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('File APIs fully supported in this browser!');
        component.setState({
            message: '',
            error: '',
        });
    } else {
        console.log('Attention: The File APIs are not fully supported in this browser.');
        component.setState({
            error: 'The File APIs are not fully supported in this browser.Something went wrong',
            message: ''
        });
    }
}

const downloadFile = args => {
    var data, filename, link;
    var content = args.content;
    if (content == null) return;
    let extension = args.extension || args.filename.replace(/(\.)([^.]+)$/,"$2");

    filename = args.filename || `baboon_exports${+new Date()}.${extension}`;

    if (/csv/i.test(extension)) {
        content = 'data:text/csv;charset=utf-8,' + content;
    }
    else if (/txt/i.test(extension)) {
        content = 'data:text;charset=utf-8,' + content;
    }
    else {
        content = 'data:text;charset=utf-8,' + content;
    }
    data = encodeURI(content);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
},

    validateFile = (file, { maxSize, excludeFormat }) => {
        let validationPassed = false;
        const excluded = new RegExp(excludeFormat);
        const fileSize = file.size * 0.001;
        if (fileSize <= maxSize && !excluded.test(file.type)) {
            validationPassed = true;
        }
        return validationPassed;
    },

    validateContent = (content, format) => {
        switch (format) {
            case 'sshKey':
                var rsa = new r.RSAKey();
                try {
                    rsa.readPrivateKeyFromPEMString(content);
                    return true;
                } catch (err) {
                    return false;
                }
            default: break;
        }
    },

    saveResultsToCSV = QueryResults => {
        let fileContent = OBJtoCSVConverter(QueryResults);
        // console.log(fileContent);
        downloadFile({
            content: fileContent,
            extension: 'csv',
            filename: `baboon_results${+new Date()}.csv`
        });
    },

    testFileExtension = (fileName,acceptableFileFormats) => {
        var acceptable = false;
        var extension = fileName.match(/\.([^.]+)$/);
        acceptableFileFormats.forEach(format =>{
            var acceptRegex = new RegExp(format);
            if(acceptRegex.test(extension))
                acceptable = true;
        });
        // if (/\.bab|\.csv|\.js|\.json/.test(matches)) {
        //     return true;
        // }
        return acceptable;
    },

    handleFilesSelect = async (component, e, resultText, saveToState, callback, type, acceptableFileFormats) => {
        const files = e.target.files; // FileList object
        [...files].forEach(file => {
            const reader = new FileReader();
            reader.onload = async () => {
                if (testFileExtension(file.name,acceptableFileFormats)) {
                    let text = reader.result;
                    // let newState = JSON.parse(text);
                    // console.log(text);
                    await saveFileToState(component, resultText, file, text, type);
                    callback(text);
                }
                else {
                    if(saveToState!== false){
                        component.setState({
                            [resultText]: '',
                            error: 'File format error: the file is not in a valid file format',
                        });
                    }
                }
            };
            reader.readAsText(file);
        });
        e.target.value = '';
    },

    saveFileToState = async (component, resultText, file, text, type) => {
        let output = [];
        // console.log(text);
        output.push({
            fileContent: text,
            name: file.name,
            size: Math.round(file.size * 0.001),
            type: file.type === '' || /\.bab$/.test(file.name) ? 'baboon.query.file' : 'n/a', // or json
            lastModified: file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : file.lastModified ? file.lastModified : 'n/a'
        })
        if(type && type === 'message'){
            await component.setState({ message: { ...component.state.message, attachment: output}, error:'' });
        } else {
            await component.setState({
                [resultText]: '',
                error: '',
                uploadedFiles: output
            })
        }
    };

export { fileAPICheck,downloadFile, saveResultsToCSV, testFileExtension, validateFile, validateContent, handleFilesSelect, saveFileToState };
