const express = require('express');
const routes = express.Router();
const fileConverter = require('../controller/file_converter');

// file convert csv file to json 

routes.get('/csv-to-json',fileConverter.csv_to_json);

// file convert json to csv   

routes.post('/json-to-csv',fileConverter.json_to_csv);

module.exports = routes;