const express = require('express');
const routes = express.Router();
const fileConverter = require('../controller/file_converter');
const {verifyTokenAndAdmin} = require("../middleware/verifications");


// file convert csv file to json 

routes.get('/csv-to-json',verifyTokenAndAdmin,fileConverter.csv_to_json);

// file convert json to csv   

routes.post('/json-to-csv',verifyTokenAndAdmin,fileConverter.json_to_csv);

module.exports = routes;