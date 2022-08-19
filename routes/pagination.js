const express = require("express");
const routes = express.Router();
const paginationRoutes = require(`../controller/pagination`);
const {verifyTokenAndAdmin} = require("../middleware/verifications");



routes.get('/jsonplaceHolder',verifyTokenAndAdmin,paginationRoutes.jsonPlaceHolder)

routes.get('/swapi',verifyTokenAndAdmin,paginationRoutes.swapi);

module.exports = routes;