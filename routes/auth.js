const express = require("express");
const routes = express.Router();
const authRoutes = require("../controller/auth");
const { verifyUsers } = require("../middleware/verifications");

// registration route -----------------------------------

routes.post("/register", authRoutes.postRegister);

// get verifications routes ------------------------------
routes.get("/verifie-email", authRoutes.emailVerifications);

// post login -------------------------------------------

routes.post("/login", verifyUsers, authRoutes.postLogin);

// forget-password --------------------------------------

routes.put("/forgot-password", verifyUsers, authRoutes.forgetPassword);

// reset-password ---------------------------------------

routes.put("/reset-password", verifyUsers, authRoutes.resetPassword);

module.exports = routes;
