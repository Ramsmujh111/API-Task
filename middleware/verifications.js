const jwt = require("jsonwebtoken");
const User = require('../models/user');

//verify web token
const verifyToken = (req, res, next) => {
  // access token from the header
  const authHeader = req.headers["x-access-token"];
  console.log(authHeader);
  if (authHeader) {
    // access the token from bearar
    jwt.verify(authHeader, process.env.JWT_SECRET_KEY, (err, user) => {
      // if err return error
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      //  crete the new req.user
      req.user = user;
      console.log(req.user);
      // console.log(req.user);
      next();
    });
  } else {
    res.status(401).json({ message: "You are not authenticated , user!" });
  }
};

// verified User and authorize user is verified: 
const verifyUsers =async (req, res, next) => {
  verifyToken(req, res,async () => {
    const user = await User.findOne({_id:req.user._id});
    // console.log(user);
    if (req.user.isVerifiead === user.isVerifiead) {
      next();
    } else {
      res.status(401).json({
        status:false,
        message:'Unauthorized'
      });
    }
  });
};

// this token is authenticate the admin
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: "You are not allow to do that" });
      }
    });
  };

module.exports = {
  verifyUsers,
  verifyTokenAndAdmin,
};

