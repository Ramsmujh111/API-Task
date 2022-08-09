const express = require("express");
const routes = express.Router();
const paginationRoutes = require(`../controller/pagination`);

/**
 * pagination routes 
 *   method - get
 */
/**
 * @swagger
 * 
 */
routes.get('/jsonplaceHolder' , paginationRoutes.jsonPlaceHolder)

routes.get('/swapi',paginationRoutes.swapi);

module.exports = routes;