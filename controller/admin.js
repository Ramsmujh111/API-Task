const User = require("../models/user");
const { validationSchema } = require("../middleware/validations");
const bcrypt = require("bcrypt");
const logger = require(`../config/winston`);
const nodemailer = require("nodemailer");

/**
 * email configuration 
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
 * @description get method for fetch all user
 * @param {*} req 
 * @param {*} res 
 * @param {string} name of the user 
 * @return {object} user
 *  
 */
exports.getAllUser = async (req, res) => {
  const query = req.query.name;
  try {
    const user = query
      ? await User.findOne({ userName: query }, { deletedAt: false })
      : await User.find({ deletedAt: false });
    res.status(200).json({
      status: true,
      message: "All user",
      user,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

/**
 * @description get method for fetch all verified users 
 * @param {*} req 
 * @param {*} res 
 * @param {boolean} find verified user in data
 * @return {object} user return find user
 */
exports.getAllVerifiedUser = async (req, res) => {
  const query = req.query.verified;
  try {
    const user = await User.find(
      { isVerifiead: JSON.parse(query) },
      { deletedAt: false }
    );
    if (!user || Object.keys(user).length <= 0) {
      logger.error(`user is not founds`);
      return res.status(400).json({
        status: false,
        message: "user is not fonds",
      });
    }
    logger.info(`successfully we get all verified users`, user);
    res.status(200).json({
      status: true,
      message: "all verified user",
      user,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

/**
 * @description put method update the particular user
 * @param {*} req 
 * @param {*} res 
 * @param {string} id find user by id and update
 * @return {object} user return updated user
 */
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    // log info
    logger.info(`user update successfully............`);
    res.status(200).json({
      status: true,
      message: "update user ",
      updatedUser,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};
/**
 * @description post method for create user by admin
 * @param {*} req 
 * @param {*} res 
 * @param {string} user name
 * @param {string} user password
 * @param {email} user email
 * @param {string} user confirm password
 * @returns {object} confirm user details
 */
exports.createUser = async (req, res) => {
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
    // check if password is not generate
    if (!hasPassword) {
      logger.error(`hash password is not created`);
      return res.status(400).json({
        status: false,
        message: `hash password is not created`,
      });
    }
    // store the data in data base
    const newUser = new User({
      userName: validation.userName,
      email: validation.email,
      password: hasPassword,
      isAdmin: validation.isAdmin,
      isVerifiead: validation.isVerifiead,
    });
    // if user is store in database-------
    logger.info(`user has been created`);
    newUser.save();
    // send mail for the verification 
    let details = {
      from: `dev.bit.ram@gmail.com`,
      to: newUser.email,
      subject: `register verification mail`,
      html: `<h2>${newUser.userName}! Thanks for registering on our side</h2>
             <h4> Please verified your mail to continue... </h4>
             <a href="http://${process.env.CLIENT_HOST}/api/user/verify-email?email=${newUser.email}">click to verify Email</a>  
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
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

/**
 * @description get method for get user by id 
 * @param {*} req 
 * @param {*} res 
 * @param {string} id user id 
 * @returns {object} user details return
 */ 
exports.getUserById = async (req, res) => {
  const paramId = req.params.id;
  try {
    const user = await User.findById(paramId);
    if(user.deletedAt){
       return res.status(203).json({
        status:false,
        message:`we did't find user with this id`
       })
    }
    if (!user && Object.keys(user).length <= 0) {
      return res.status(400).json({
        status: false,
        message: `user with this is not available`,
      });
    }
    logger.info(`user find successfully`);
    res.status(200).json({
      status: true,
      message: "user details is ",
      user,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

/**
 * @description put method for soft delete user
 * @param {*} req 
 * @param {*} res 
 * @param {string} id find by user id and update as deletedAt
 * @returns {string} message user has been deleted
 */
exports.softDelete = async (req, res) => {
  try {
    const paramId = req.params.id;
    //  find by id and update the status in the deleteAt  = false or true
    const user = await User.findByIdAndUpdate(
      paramId,
      { $set: { deletedAt: true } },
      { new: true }
    );
    if (!user) {
      logger.error(`user is not found`);
      return res.status(400).json({
        status: false,
        message: `user does not exist`,
      });
    }
    // send the response
    logger.info(`user is deleted successfully`);
    res.status(201).json({
      status: true,
      message: "user is deleted",
      user,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};
/**
 * @description put method for revert soft deleted user
 * @param {*} req 
 * @param {*} res 
 * @param {string} id soft deleted user id
 * @returns {message} message revert deleted user
 */
exports.revertUser = async (req, res) => {
  try {
    const paramId = req.params.id;
    //  find by id and update the status in the deleteAt  = false or true
    const user = await User.findByIdAndUpdate(
      paramId,
      { $set: { deletedAt: false } },
      { new: true }
    );
    if (!user) {
      logger.error(`user does not exist with this id`);
      return res.status(400).json({
        status: false,
        message: `user does not exist`,
      });
    }
    // send the response
    res.status(201).json({
      status: true,
      message: "deleted user is revert",
      user,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};
