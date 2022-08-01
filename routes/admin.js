const express = require('express');
const routes = express.Router();
const adminRoutes = require('../controller/admin');
const {verifyUsers,verifyTokenAndAdmin} = require('../middleware/verifications');


// get all users -----------------------------------------------------------------------------------------

routes.get('/all-user',verifyTokenAndAdmin,adminRoutes.getAllUser);

// get verified youser -----------------------------------------------------------------------------------

routes.get('/verified-user',verifyTokenAndAdmin,adminRoutes.getAllVerifiedUser);

// update user and params id; ---------------------------------------------------------------------------

routes.put('/update/:id',verifyTokenAndAdmin,adminRoutes.updateUser);

// create the new user ---------------------------------------------------------------------------------

routes.post('/creat-user',verifyTokenAndAdmin,adminRoutes.createUser);

// get params by id ------------------------------------------------------------------------------------

routes.get('/getById/:id',verifyTokenAndAdmin,adminRoutes.getUserById);

// put soft delte user in the database

routes.put('/soft-delete',verifyTokenAndAdmin,adminRoutes.softDelete);

// delete user by param id 

routes.put('/revert-deleted-user:/id',verifyTokenAndAdmin,adminRoutes.reverUser);

module.exports = routes;

