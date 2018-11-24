'use strict';

// const fs = require('fs');
// const host = require('../host');
var parser = require('mongodb-query-parser');
var EJSON = require('mongodb-extended-json');
var mongoUtil = require('./mongoUtil');

exports.findAll = function (req, res) {
    console.log('findAll');

    res.json({ findAll: true });
};

exports.handleQueryExecution = function (req, res) {
    try {
        console.log('executing query...');
        var db = mongoUtil.getDB();
        var resultObj = void 0,
            finalQuery = void 0,
            parsedQuery = void 0;
        // console.log(db.collection(req.body.collection))
        if (/distinct/.test(req.body.queryType)) {
            var splitQuery = req.body.mongoObject.split(/,/);
            var distinct = parser(splitQuery[0]);
            var values = parser(splitQuery[1]);
            resultObj = db.collection(req.body.collection)[req.body.queryType](distinct, values, function (err, result) {
                res.json({
                    parserQuery: parsedQuery,
                    results: result
                });
            });
        } else {
            switch (req.body.queryType) {
                case 'aggregate':
                    finalQuery = '[' + req.body.mongoObject + ']';
                    break;
                default:
                    finalQuery = req.body.mongoObject;
                    break;
            }
            console.log(finalQuery);
            parsedQuery = parser(finalQuery);
            console.log(parsedQuery);
            resultObj = db.collection(req.body.collection)[req.body.queryType](parsedQuery);
            resultObj.toArray(function (err, result) {
                res.json({
                    parserQuery: parsedQuery,
                    results: result
                });
            });
        }
    } catch (err) {
        res.json({
            Error: err + '. This occurred during query execution. Check the query parameters'
        });
    }
};