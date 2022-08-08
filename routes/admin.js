const express = require("express");
const routes = express.Router();
const adminRoutes = require("../controller/admin");
const {
  verifyUsers,
  verifyTokenAndAdmin,
} = require("../middleware/verifications");

// get all users -----------------------------------------------------------------------------------------
/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         example: 234kfjjmf48j_0kfj
 *       userName:
 *         type: string
 *         example: xyz_kumar
 *       email:
 *         type: string
 *         example: google@gmail.com
 *       isAdmin:
 *         type: boolean
 *         example: true/false
 *       isVerified:
 *         type: boolean
 *         example: ture / false
 *      
 */
/**
 * @swagger
 * /api/admin/all-user:
 *     get:
 *       summary: get all user
 *       description: get all user
 *       parameters:
 *         - in: header
 *           name: x-access-token
 *           schema:
 *             type: string
 *             required: true
 *       responses:
 *         200:
 *           description: all user
 *           content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 *          
 *          
 */
routes.get("/all-user", verifyTokenAndAdmin, adminRoutes.getAllUser);

// get verified youser -----------------------------------------------------------------------------------
/**
 * @swagger
 * /api/admin/verified-user:
 *     get:
 *       summary: all verified user
 *       description: find all verified user
 *       parameters:
 *         - in: header
 *           name: x-access-token
 *           schema:
 *             type: string
 *             required: true
 *         - in: query
 *           name: verified
 *           schema:
 *             type: boolean
 *             required: true
 *       responses:
 *         200:
 *           description: all user
 *           content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 *         400:
 *           description: Bad Request 
 * 
 */
routes.get(
  "/verified-user",
  verifyTokenAndAdmin,
  adminRoutes.getAllVerifiedUser
);

// update user and params id; ---------------------------------------------------------------------------
/**
 * @swagger
 * /api/admin/update/{id}:
 *      put:
 *       summary: find by id and update
 *       description: user update by id 
 *       requestBody:
 *           description: update any field which you wanna
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *       parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              required: true
 *              example: expi948_3fdj_
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            schema:
 *             type: string
 *             required: true
 *                                                                          
 *       responses:
 *            200:
 *              description: updated user fieald 
 *              content:
 *                application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 *            400:
 *              description: Bad Request 
 *      
 */

routes.put("/update/:id", verifyTokenAndAdmin, adminRoutes.updateUser);

// create the new user ---------------------------------------------------------------------------------
/**
 * @swagger
 * components:
 *    schema:
 *     createUser:
 *       type: object
 *       properties:
 *         userName:
 *            type: string
 *            required: true
 *            description: name of user
 *            example: ramsmujh
 *         email:
 *            type: string
 *            required: true
 *            description: email of user
 *            example: xyz@gmail.com
 *         password:
 *            type: string
 *            required: true
 *            description: password of user
 *            example: ramsmujh@123
 *         confirm_password:
 *            type: string
 *            required: true
 *            description: conform password of user of user
 *            example: ramsmujh@123
 *         isAdmin:
 *            type: boolean
 *            example: true / false
 *         isVerified:
 *            type: boolean
 *            example: true / false
 *
 */
/**
 * @swagger
 * /api/admin/create-user:
 *     post:
 *       summary: admin create user
 *       description: admin create user
 *       requestBody:
 *           description: create user 
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schema/createUser'
 *       parameters:
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            schema:
 *             type: string
 *             required: true 
 *       responses:
 *            200:
 *              description: user created  
 *              content:
 *                application/json:
 *                   schema:
 *                     $ref: '#/components/schema/createUser'
 *            400:
 *              description: Bad Request        
 */

routes.post("/create-user", verifyTokenAndAdmin, adminRoutes.createUser);

// get params by id ------------------------------------------------------------------------------------
/**
 * @swagger
 * /api/admin/getById/{id}:
 *   get:
 *     summary: get user by id
 *     description: get user by id
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              required: true
 *              example: expi948_3fdj_
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            schema:
 *             type: string
 *             required: true
 *                                                                          
 *     responses:
 *            200:
 *              description: find user by id
 *              content:
 *                application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 *            400:
 *              description: Bad Request 
 *     
 */
routes.get("/getById/:id", verifyTokenAndAdmin, adminRoutes.getUserById);

// put soft delte user in the database
/**
 * @swagger
 * /api/admin/soft-delete/{id}:
 *    put:
 *     summary: sotf-delete
 *     description: find by id and delete
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              required: true
 *              example: expi948_3fdj_
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            schema:
 *             type: string
 *             required: true
 *                                                                          
 *     responses:
 *            200:
 *              description: deleted user
 *              content:
 *                application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 *            400:
 *              description: Bad Request 
 */


routes.put("/soft-delete/:id", verifyTokenAndAdmin, adminRoutes.softDelete);

// delete user by param id
/**
 * @swagger
 * /api/admin/revert-deleted-user/{id}:
 *    put:
 *     summary: revert sotf-delete
 *     description: find by id and revert delete user
 *     parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              required: true
 *              example: expi948_3fdj_
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            schema:
 *             type: string
 *             required: true
 *                                                                          
 *     responses:
 *            200:
 *              description: revert deleted user
 *              content:
 *                application/json:
 *                   schema:
 *                     $ref: '#/components/schemas/User'
 *            400:
 *              description: Bad Request 
 */

routes.put(
  "/revert-deleted-user/:id",
  verifyTokenAndAdmin,
  adminRoutes.revertUser
);

module.exports = routes;
