const { queryValidator, connectionValidator } = require('./validators');
// const {upload, moveFile} = require('./controllers/fileUpload');
const http = require('http'),
    httpProxy = require('http-proxy');


module.exports = (app) =>{
    const query = require('./controllers/queryMethods');
    const database = require('./controllers/dbConnection');


    app.get('/mongo', query.findAll);

    app.post('/query', queryValidator, query.handleQueryExecution);

    app.post('/database/connection', /*connectionValidator,*/ database.handleConnection);

    //add more!.. like delete('/mongo/:id',query.delete); 
}
