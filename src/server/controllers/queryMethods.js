// const fs = require('fs');
// const host = require('../host');
const parser = require('mongodb-query-parser');
var EJSON = require('mongodb-extended-json');
const mongoUtil = require('./mongoUtil');

 
exports.findAll = (req, res) => {
    console.log('findAll');

    res.json({findAll:true})
};

exports.handleQueryExecution = (req,res) => {
    try{
        console.log(`executing query...`);
        const db = mongoUtil.getDB();
        let resultObj, finalQuery, parsedQuery;
        // console.log(db.collection(req.body.collection))
        if (/distinct/.test(req.body.queryType)){
            const splitQuery = req.body.mongoObject.split(/,/);
            const distinct = parser(splitQuery[0]);
            const values = parser(splitQuery[1]);
            resultObj = db.collection(req.body.collection)[req.body.queryType](distinct, values, (err, result) => {
                res.json({
                    parserQuery: parsedQuery,
                    results: result
                })
            });
        }
        else {
            switch (req.body.queryType) {
                case 'aggregate':
                    finalQuery = `[${req.body.mongoObject}]`;
                    break;
                default:
                    finalQuery = req.body.mongoObject;
                    break;
            }
            console.log(finalQuery);
            parsedQuery = parser(finalQuery);
            console.log(parsedQuery);
            resultObj = db.collection(req.body.collection)[req.body.queryType](parsedQuery)
            resultObj.toArray((err, result) => {
                res.json({
                    parserQuery: parsedQuery,
                    results: result
                })
            });
        }
    }
    catch(err){
        res.json({
            Error: `${err}. This occurred during query execution. Check the query parameters`
        });
    }
};
