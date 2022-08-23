const express = require("express");
const routes = express.Router();
const authRoutes = require("../controller/auth");
const { verifyUsers,verifyTokenAndAdmin,verificationToken,login_verify } = require("../middleware/verifications");

// registration route -----------------------------------

routes.post("/register", authRoutes.postRegister);

// get verifications routes ------------------------------
routes.get("/verify-email", authRoutes.emailVerifications);

// post login -------------------------------------------

routes.post("/login", verifyUsers, authRoutes.postLogin);

// forget-password --------------------------------------

routes.put("/forgot-password", verifyUsers, authRoutes.forgetPassword);

// reset-password ---------------------------------------

routes.put("/reset-password", verificationToken, authRoutes.resetPassword);

// change password ---------------------------------------
routes.put('/change-password',login_verify,authRoutes.changePassword);

module.exports = routes;
