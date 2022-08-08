const express = require("express");
const routes = express.Router();
const authRoutes = require("../controller/auth");
const { verifyUsers } = require("../middleware/verifications");

// registration route -----------------------------------
// define the swagger schemas
/**
 * @swagger
 * components:
 *    schema:
 *     userSchema:
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
 * /api/user/register:
 *   post:
 *      summary: create the user
 *      description: create the user
 *      requestBody:
 *        description: user data form from optional data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *               $ref: '#/components/schema/userSchema'
 *      responses:
 *        201:
 *          description: user created successfully
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/userSchema'
 *        400:
 *          description: email id already exist
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/userSchema'
 *        200:
 *          description: user created successfully
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/userSchema'
 */
routes.post("/register", authRoutes.postRegister);

// get verifications routes ------------------------------
/**
 * @swagger
 * components:
 *    schemas:
 *     userSchema:
 *       type: object
 *       properties:
 *         status:
 *            type: boolean
 *            example: true / false
 *         message:
 *            type: string
 *            example: success message
 */
/**
 * @swagger
 * /api/user/verifie-email:
 *    get:
 *     summary: verifie the user mail
 *     description: email verified through the query paramas
 *     parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           description: email id enter to verified the you mail
 *         - in: header
 *           name: x-access-token
 *           schema:
 *             type: string
 *           description: enter the your jwt token
 *          
 *     responses:
 *       200:
 *        description: return a verification token to loggin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/userSchema'
 *       403:
 *        description: Forbidden
 *        content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/userSchema'
 *       400:
 *        description: can't find with this email id
 *        content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/userSchema'
 *       409:
 *        description: user already exist!
 *        content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/userSchema'
 *       401:
 *        description: you'r not authorize
 *        content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/userSchema'
 *
 */

routes.get("/verifie-email", authRoutes.emailVerifications);

// post login -------------------------------------------
/**
 * @swagger
 * loginSchemas:
 *    schemas:
 *     userDetails:
 *       type: object
 *       properties:
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
 */

/**
 * @swagger
 * /api/user/login:
 *    post:
 *      summary: login a register user
 *      description: request body to enter the email and password
 *      requestBody:
 *           description: email and password
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  email:
 *                     type: string
 *                     required: true
 *                     description: email of user
 *                     example: xyz@gmail.com
 *                  password:
 *                     type: string
 *                     required: true
 *                     description: password of user
 *                     example: ramsmujh@123
 *      parameters:
 *         - in: header
 *           name: x-access-token
 *           schema:
 *             type: string
 *           required: true
 * 
 *      responses:
 *        200: 
 *          description: success
 *          content:
 *           application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  status:
 *                     type: boolean
 *                     example: true
 *                  message:
 *                     type: string
 *                     example: user login successfully complete !
 *                  profile:
 *                     schema:
 *                        type: object
 *                        properties:
 *                          _id: 
 *                             type: string
 *                             example: 944nfdndffdfndk
 *                          userName:
 *                             type: string
 *                             example: rahul
 *                          email:
 *                             type: string
 *                             example: rahul@gmail.com
 *                          password:
 *                             type: string
 *                             example: ramsmsm56433
 *                          isAdmin:
 *                             type: boolean
 *                             example: true / false
 *                          isVerified:
 *                             type: boolean
 *                             example: true/ false
 * 
 *       
 *                  
 */

routes.post("/login", verifyUsers, authRoutes.postLogin);

// forget-password --------------------------------------
/**
 * @swagger
 * /api/user/forgot-password:
 *     put:
 *       summary: forgot password ganerate email link
 *       description: forget mail genarate
 *       requestBody:
 *           description: email and password
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  email:
 *                     type: string
 *                     required: true
 *                     description: email of user
 *                     example: xyz@gmail.com
 *       parameters:
 *         - in: header
 *           name: x-access-token
 *           schema:
 *             type: string
 *           required: true
 *      
 *       responses:
 *        250: 
 *          description: success
 *          content:
 *            application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                      type: boolean
 *                      example: true
 *                   message:
 *                      type: string
 *                      example: email have been send kindly forget-password !
 *                   reset_token:
 *                      type: string
 *                      example: fkdlflkdnlsdfdnfkjdfgfdnkjf
 *        400: 
 *          description: success
 *          content:
 *            application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                      type: boolean
 *                      example: false
 *                   message:
 *                      type: string
 *                      example: user is not match       
 *       
 */

routes.put("/forgot-password", verifyUsers, authRoutes.forgetPassword);

// reset-password ---------------------------------------
/**
 * @swagger
 * /api/user/reset-password:
 *     put:
 *       summary: reset password 
 *       description: click the link and reset password
 *       requestBody:
 *           description: email and password
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  newPassword:
 *                     type: string
 *                     required: true
 *                     description: email of user
 *                     example: xyz@gmail.com
 *       parameters:
 *          - in: header
 *            name: x-access-token
 *            schema:
 *              type: string
 *            required: true
 *          - in: query
 *            name: token
 *            schema:
 *              type: string
 *            description: enter the queary token to reset the password
 *                                                   
 *       responses:
 *        200: 
 *          description: success
 *          content:
 *            application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                      type: boolean
 *                      example: true
 *                   message:
 *                      type: string
 *                      example: password has been chenged !
 *                   new_password:
 *                      type: string
 *                      example: fkdlflkd*******jdfgfdnkjf
 *                   old_password:
 *                      type: string
 *                      example: fkdlflk***********dfgfdnkjf
 *        400: 
 *          description: success
 *          content:
 *            application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                      type: boolean
 *                      example: false
 *                   message:
 *                      type: string
 *                      example: user is not match       
 *
 *       
 */

routes.put("/reset-password", verifyUsers, authRoutes.resetPassword);

module.exports = routes;
