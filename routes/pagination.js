const express = require("express");
const routes = express.Router();
const paginationRoutes = require(`../controller/pagination`);


routes.get('/jsonplaceHolder' , paginationRoutes.jsonPlaceHolder)

/**
 * @swagger
 * /api/swapi:
 *    get:
 *     summary: set the pagination 
 *     description: set the query as a page and limit
 *     parameters:
 *          - in: query
 *            name: page
 *            required: true
 *            schema:
 *              type: integer
 *              required: true
 *              example: 1   
 *          - in: query
 *            name: limit
 *            required: true
 *            schema:
 *              type: integer
 *              required: true
 *              example: 1   
 *          - in: query
 *            name: sortBy
 *            schema:
 *              type: string
 *              example: id-name-title   
 *          - in: query
 *            name: orderBy
 *            schema:
 *              type: string
 *              example: asc/desc   
 * 
 *     responses:
 *        200: 
 *          description: success
 *          content:
 *           application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  previouse:
 *                     type: object
 *                     properties:
 *                       page:
 *                         type: interger
 *                         example: 2
 *                       limit: 
 *                         type: interger
 *                         example: 2
 *                  next:
 *                     type: object
 *                     properties:
 *                       page:
 *                         type: interger
 *                         example: 2
 *                       limit: 
 *                         type: interger
 *                         example: 2
 *                  data:
 *                     type: array
 *                     items:
 *                       page:
 *                         type: interger
 *                         example: 2
 *                       limit: 
 *                         type: interger
 *                         example: 2
 *                     
 *     
 * 
 */

routes.get('/swapi',paginationRoutes.swapi);

module.exports = routes;