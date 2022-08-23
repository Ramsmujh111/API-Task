const express = require("express");
const routes = express.Router();
const paginationRoutes = require(`../controller/pagination`);
const {login_verify} = require("../middleware/verifications");



routes.get('/jsonplaceHolder', login_verify,paginationRoutes.jsonPlaceHolder)

routes.get('/swapi',login_verify,paginationRoutes.swapi);

module.exports = routes;