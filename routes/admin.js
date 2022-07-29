const express = require('express');
const routes = express.Router();
const adminRoutes = require('../controller/admin');
const {verifyUsers,verifyTokenAndAdmin} = require('../middleware/verifications');


// get all users -----------------------------------------------------------------------------------------

routes.get('/allUser',verifyTokenAndAdmin,adminRoutes.getAllUser);

// get verified youser -----------------------------------------------------------------------------------

routes.get('/verified',verifyTokenAndAdmin,adminRoutes.getAllVerifiedUser);

// update user and params id; ---------------------------------------------------------------------------

routes.put('/update/:id',verifyTokenAndAdmin,adminRoutes.updateUser);

// create the new user ---------------------------------------------------------------------------------

routes.post('/creat-user',verifyTokenAndAdmin,adminRoutes.createUser);

// get params by id ------------------------------------------------------------------------------------

routes.get('/getById/:id',verifyTokenAndAdmin,adminRoutes.getUserById);

// delete user by param id 

module.exports = routes;

