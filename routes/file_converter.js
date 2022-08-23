const express = require('express');
const routes = express.Router();
const fileConverter = require('../controller/file_converter');
const {login_verify} = require("../middleware/verifications");


// file convert csv file to json 

routes.get('/csv-to-json',login_verify,fileConverter.csv_to_json);

// file convert json to csv   

routes.post('/json-to-csv',login_verify,fileConverter.json_to_csv);

module.exports = routes;