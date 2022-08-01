const User = require("../models/user");
const { validationSchema } = require("../middleware/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendgridTranspots = require("nodemailer-sendgrid-transport");

const transport = nodemailer.createTransport(
  sendgridTranspots({
    auth: {
      api_key: process.env.sendgrid_API_key,
    },
  })
);

// register page
exports.postRegister = async (req, res) => {
  try {
    const validation = await validationSchema.validateAsync(req.body);
    // if user doesExist
    const doesExits = await User.findOne({ email: validation.email });
    if (doesExits) {
      return res.status(400).json({
        status: false,
        message: "Emai id already exist",
      });
    }
    // hashing the password:
    const salt = await bcrypt.genSalt(10);
    const hasPassword = bcrypt.hashSync(validation.password, salt);
    // store the data in data base
    const newUser = new User({
      userName: validation.userName,
      email: validation.email,
      password: hasPassword,
      isAdmin: validation.isAdmin,
      isVerifiead: validation.isVerifiead,
    });
    // if user is store in database-------
    newUser.save();
    // send the email to user
    transport.sendMail({
      to: newUser.email,
      from: "dev.bit.ram@gmail.com",
      subject: "Verifications mail",
      html: `<h1>please verified the mail using this link ${process.env.Client_host}/user/verify-email?email="${newUser.email}"<h1>`,
    });
    // generating a verified Token
    // create the jsonwebtoken
    const email_access_token = jwt.sign(
      {
        email: newUser.email,
        isVerifiead: newUser.isVerifiead,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );
    //   email verifid token is save is database:
    newUser.emailVerifiedToken = email_access_token;
    // sending the responce message is suceed
    res.status(200).json({
      status: true,
      message: "verification mail is send",
      verifications_token: email_access_token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// email verifications -------------------------------------------------------------------------------
exports.emailVerifications = (req, res) => {
  //verify web token
  const query_email = req.query.email;
  // access token from the header
  const authHeader = req.headers["x-access-token"];
  if (authHeader) {
    // access the token from bearar
    jwt.verify(authHeader, process.env.JWT_SECRET_KEY, async (err, user) => {
      // if err return error
      if (err) {
        return res.status(403).json({
          status:false,
          message: "Incorrent or Expire Link" 
        });
      }
      // find the user if exist in the database is save id
      let newUser = await User.findOne({ email: query_email });
      // //   if verified_user
      if (!newUser) {
        return res.status(400).json({
          status: false,
          message: "somethis goes wrong",
        });
      } else if (newUser.isVerifiead) {
        return res.status(409).json({
          status: false,
          message: "Already Exists",
        });
      }
      // //  so we can set the verified user is the true here
      // verified_user.isVerifiead = true;
      newUser.isVerifiead = true;
      newUser.emailVerifiedToken = null;
      newUser.save();
      user.isVerifiead = true;
      // create the new login access key
      const login_access_key = jwt.sign(
        {
          _id: newUser._id,
          isVerifiead: newUser.isVerifiead,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" }
      );
      user.login_access_key = login_access_key;

      res.status(200).json({
        status: true,
        message: "Verificatins Succucessfuly complete!. please login",
        data: user,
      });
    });
  } else {
    res.status(401).json({ message: "You are not authenticated , user!" });
  }
};

// user login ----------------------------------------------------------------------------
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // if user is not found
    if (!user) {
      res.status(401).json({
        message: "emai and password is not match",
      });
    } else {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      //if password is not found
      if (!isPasswordMatch) {
        res.status(404).json({
          message: "emai and password is not match",
        });
      } else {
        // create the jsonwebtoken
        const accessToken = jwt.sign(
          {
            _id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "2d" }
        );
        // save the token
        user.accessToken = accessToken;
        // access token save in database
        user.save();
        res.status(200).json({
          status: true,
          message:
            "Welcome" +
            "  " +
            user.userName +
            " " +
            " Login successfully complete ",
          profile: user,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

// forget-passsword-------------------------------------------------------

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email: email });
    // if user is not exist
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User with this mail does not exist",
      });
    }
    // create the resetToken
    const accessToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.RESET_PASSWORD_KEY,
      { expiresIn: "2h" }
    );
    // sending the mail to reset the password:
    transport.sendMail({
      to: user.email,
      from: "dev.bit.ram@gmail.com",
      subject: "forgot-password",
      html: `<h1>please clink the this link forgot-password <a>${process.env.Client_host}/user/forgot-password/:${accessToken}"</a><h1>`,
    });
    // store the data is the resetLink in token
    user.resetLink = accessToken;
    // save the user
    user.save();
    res.status(250).json({
      status: true,
      message: "email have been send kindly forget-password",
      resetLink: user.resetLink,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// reset-password -------------------------------------------------------------------------

exports.resetPassword = async (req, res, next) => {
  const resetLink = req.query.token;
  const new_Password = req.body.newPassword;
  try {
    // decode the reset_password_key
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async (err, user) => {
      // if something is error
      if (err) {
        return res.status(401).json({
          status: false,
          message: err.message,
        });
      }
      // find the user here
      let save_user = await User.findOne({ resetLink: resetLink });
      // if not user
      if (!save_user) {
        return res.status(400).json({
          status: false,
          message: "user with this token is not exist",
        });
      }
      // hasing the password and save
      // hashing the password:
      const salt = await bcrypt.genSalt(10);
      const hasPassword = bcrypt.hashSync(newPassword, salt);
      let old_password = save_user.password;
      //   update the password
      save_user.password = hasPassword;
      // reset the reset link
      save_user.resetLink = null;
      // save new password into databaes
      save_user.save();
      res.status(200).json({
        status: true,
        message: "password has been chenged ,",
        newPassword,
        old_password,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
