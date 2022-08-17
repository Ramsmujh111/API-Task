const User = require("../models/user");
const { validationSchema } = require("../middleware/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const logger = require("../config/winston");

/**
 * Email configuration
 */
let mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * register page
 * @param {*} req 
 * @param {*} res 
 * @param {string} user name
 * @param {string} user email
 * @param {string} user password
 * @param {string} user confirm password
 * @param {boolean} user isAdmin
 * @returns {object} user email verification message
 */
exports.postRegister = async (req, res) => {
  try {
    const validation = await validationSchema.validateAsync(req.body);
    // if user doesExist
    const doesExits = await User.findOne({ email: validation.email });
    if (doesExits) {
      logger.error(`Email id already exist`);
      return res.status(400).json({
        status: false,
        message: "Email id already exist",
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
    let details = {
      from: `dev.bit.ram@gmail.com`,
      to: newUser.email,
      subject: `register verification mail`,
      html: `<h2>${newUser.userName}! Thanks for registering on our side</h2>
             <h4> Please verified your mail to continue... </h4>
             <a href="http://${process.env.CLIENT_HOST}/api/user/verify-email?email=${newUser.email}">click to Verify Email</a>  
      `,
    };
    // sending the response message is succeed
    mailTransporter.sendMail(details, (err) => {
      if (err) {
        logger.error(err.message);
        return res.status(400).json({
          status: false,
          message: err.message,
        });
      }
      logger.info(`verifications mail has been send`);
      return res.status(201).json({
        status: true,
        message: "verification mail has been send",
      });
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * email verifications
 * @param {*} req 
 * @param {*} res 
 * @param {string} user email for conform the user is register user or not
 * @returns {object} user details
 */ 
exports.emailVerifications = async (req, res) => {
  //verify web token
  try {
    const query_email = req.query.email;
    let user = await User.findOne({ email: query_email });
    // //   if verified_user
    if (!user) {
      logger.error(`we can't find with this mail id`);
      return res.status(400).json({
        status: false,
        message: "something goes wrong",
      });
    } else if (user.isVerifiead) {
      logger.info(`user already verified`);
      return res.status(409).json({
        status: false,
        message: "Already Exists",
      });
    }
    user.isVerifiead = true;
    user.save();
    // create the new login access key
    const login_access_key = jwt.sign(
      {
        _id: user._id,
        isVerifiead: user.isVerifiead,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );
    user.login_access_key = login_access_key;
    logger.info(`Verifications Successfully complete!. please login`);
    res.status(200).json({
      status: true,
      message: "Verifications Successfully complete!. please login",
      login_access_key: user.login_access_key,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * user login details
 * @param {*} req 
 * @param {*} res 
 * @param {string} user email
 * @param {string} user password
 * @returns {object} user details
 */ 
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // if user is not found
    if (!user) {
      // log is user email does't match
      logger.error(`email and password is not match`);
      res.status(401).json({
        message: "Email and password is not match",
      });
    } else {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      //if password is not found
      if (!isPasswordMatch) {
        // log if user password does't match
        logger.error(`email and password is not match`);

        res.status(404).json({
          message: "Email and password is not match",
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
        logger.info(`user logging successfully`);
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
    // if some error occurs log the error
    logger.error(error.message);
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * forget-password
 * @param {*} req 
 * @param {*} res 
 * @param {string} user email
 * @returns {object} send the mail as a response to forget-password
 */

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email: email });
    // if user is not exist
    if (!user) {
      // log if user does't not exist
      logger.error(`User with this mail does not exist`);
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
    let details = {
      from: `dev.bit.ram@gmail.com`,
      to: user.email,
      subject: `forget password link`,
      html: `<h2>${user.userName}! Please forget the password</h2>
             <a href="http://${process.env.CLIENT_HOTS}/api/user/reset-password?token=${accessToken}">click to forget the password </a>  
      `,
    };
    mailTransporter.sendMail(details, (err)=>{
      if(err){
        logger.error(err.message);
       return res.status(400).json({
          status: false,
          message: err.message
        })
      }
    })
    // store the data is the resetLink in token
    user.resetLink = accessToken;
    // save the user
    user.save();
    logger.info(`email has been send kindly forget-password`);
    res.status(250).json({
      status: true,
      message: "email have been send kindly forget-password",
      resetLink: user.resetLink,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * reset-password
 * @param {*} req 
 * @param {*} res
 * @param {string} token jwt verified token to verified user or not
 * @param {string} newPassword user enter the new password and send the old-password === newPassword
 * @return {object} return the user details
 */

exports.resetPassword = async (req, res) => {
  const resetLink = req.query.token;
  const new_Password = req.body.newPassword;
  try {
    // decode the reset_password_key
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async (err, user) => {
      // if something is error
      if (err) {
        logger.error(err.message);
        return res.status(401).json({
          status: false,
          message: err.message,
        });
      }
      // find the user here
      let save_user = await User.findOne({ _id: user._id });
      // if not user
      if (!save_user) {
        logger.error(`user with this token does't exist`);
        return res.status(400).json({
          status: false,
          message: "user with this token is not exist",
        });
      }
      // hashing the password and save
      const salt = await bcrypt.genSalt(10);
      const hasPassword = bcrypt.hashSync(new_Password, salt);
      let old_password = save_user.password;
      //   update the password
      save_user.password = hasPassword;
      // reset the reset link
      save_user.resetLink = null;
      // save new password into database
      save_user.save();
      logger.info(`password has been changed`);
      res.status(200).json({
        status: true,
        message: "password has been changed ,",
        new_Password,
        old_password,
      });
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
