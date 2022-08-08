const express = require('express');
const routes = express.Router();
const fileConverter = require('../controller/file_converter');

// file convert csv file to json 
/**
 * @swagger 
 * /api/csv-to-json:
 *  get:
 *    summary: Return a csv for to json data
 *    description: this is the form-convert-json-to cvs form !
 *    responses:
 *      200:   #status code
 *       description: cvs data to json form
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             properties:
 *                name:
 *                   type: string
 *                country: 
 *                   type: string
 *                city:
 *                   type: string
 *                addresh:
 *                   type: string
 * 
 *             example:
 *                name: ramsmujh
 *                country: india
 *                city: lucknow
 *                addresh: block-334
 * 
 * 
 *      
 *                
 *          
 */
routes.get('/csv-to-json',fileConverter.csv_to_json);

// file convert json to csv   
// json schema
/**
 * @swagger
 * components:
 *    schema:
 *      data:
 *       type: array
 *       properties:
 *         name:
 *            type: string
 *            example: ramsmujh
 *         country:
 *            type: string
 *            example: xyz@gmail.com
 *         city:
 *            type: string
 *            example: Lucknow
 *         addresh:
 *            type: string
 *            example: block-543
 *  
 */
/**
 * @swagger
 * /api/json-to-csv:
 *  post:
 *     summary: return json data to cvs form data
 *     description: convert json data to excel file
 *     requestBody:
 *   
 *        description: json data enter in the body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schema/data'
 * 
 *     responses:
 *        200:
 *          description: return a excel file 
 *          content:
 *            text/html:
 *              schema:
 *                $ref: '#/componentes/schema/data'
 *                
 *         
 *    
 *           
 *       
 *         
 */

routes.post('/json-to-csv',fileConverter.json_to_csv);

module.exports = routes;