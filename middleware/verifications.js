const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../config/winston");
const user = require("../models/user");

//verify web token
const verifyToken = (req, res, next) => {
  // access token from the header
  const authHeader = req.headers["x-access-token"];
  if (authHeader) {
    // access the token from bearer
    jwt.verify(authHeader, process.env.JWT_SECRET_KEY, (err, user) => {
      // if err return error
      if (err) {
        logger.error(`Token is not valid`);
        return res.status(403).json({ message: "Token is not valid" });
      }
      //  crete the new req.user
      req.user = user;
      next();
    });
  } else {
    logger.error(`you are not authorize user !`);
    res.status(401).json({ message: "You are not authenticated , user!" });
  }
};

// verified User and authorize user is verified:
const verifyUsers = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if(!user){
      logger.error(`Enter the valid email`);
      res.status(401).json({
        status:false,
        message:`Enter valid email to continue..`
      })
    }
    if (user.isVerifiead) {
      return next();
    } else {
      logger.error(`You're not verified user`);
      res.status(400).json({
        status: false,
        message: `You're not verified user`,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status:false,
      message:error.message
    })
  }
};

// this token is authenticate the admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      logger.error(`You are not allow to do that`);
      res.status(403).json({ message: "You are not allow to do that" });
    }
  });
};

module.exports = {
  verifyUsers,
  verifyTokenAndAdmin,
};
