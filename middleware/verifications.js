const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../config/winston");

//verify web token
const verifyToken = (req, res, next) => {
  // access token from the header
  const authHeader = req.headers["x-access-token"];
  const token = req.query.token;
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
      return next();
    });
  } else if (token) {
    jwt.verify(token, process.env.RESET_PASSWORD_KEY, (err, user) => {
      // if err return error
      if (err) {
        logger.error(`Token is not valid`);
        return res.status(403).json({ message: "Token is not valid" });
      }
      //  crete the new req.user
      req.user = user;
      return next();
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
    if (!user) {
      logger.error(`Enter the valid email`);
      return res.status(400).json({
        status: false,
        message: `Enter valid email to continue..`,
      });
    }

    if (user.isVerified) {
      return next();
    } else {
      logger.error(`Unauthorize user`);
      res.status(400).json({
        status: false,
        message: `Unauthorize user`,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// this token is authenticate the admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user._id);
      if (user.isAdmin) {
        next();
      } else {
        logger.error(`You are not allow to do that`);
        res.status(403).json({
          status: false,
          message: "You are not allow to do that",
        });
      }
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  });
};
const verificationToken = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        logger.error(`you're not authorize`);
        res.status(400).json({
          status: false,
          message: `User with this token is not found`,
        });
      }
      if (user.isVerified) {
        next();
      } else {
        logger.error(`You are not allow to do that`);
        res.status(403).json({
          status: false,
          message: "You are not allow to do that",
        });
      }
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  });
};
// login user
const login_verify = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        return next();
      }
    } catch (error) {
      logger.error(error.message);
      res.status(400).json({
        status: false,
        message: `Unauthorize User`,
      });
    }
  });
};
module.exports = {
  verifyUsers,
  verifyTokenAndAdmin,
  verificationToken,
  login_verify
};
