const User = require("../models/user");
const { validationSchema } = require("../middleware/validations");
const bcrypt = require("bcrypt");
const logger = require(`../service/logger`);

// get all user one user by name and get all user--------------------------------------------------------
exports.getAllUser = async (req, res, next) => {
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

// get all verified users -------------------------------------------------------------------------------
exports.getAllVerifiedUser = async (req, res, next) => {
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
    logger.info(`seccessfull we get all verified users`, user);
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

// update user --------------------------------------------
exports.updateUser = async (req, res, next) => {
  //   const { password } = req.body;
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
// create user -----------------------------------------------------------------------------------------
exports.createUser = async (req, res, next) => {
  try {
    const validation = await validationSchema.validateAsync(req.body);
    // if user doesExist
    const doesExits = await User.findOne({ email: validation.email });
    if (doesExits) {
      logger.error(`Email id already exist`);
      return res.status(400).json({
        status: false,
        message: "Emai id already exist",
      });
    }
    // hashing the password:
    const salt = await bcrypt.genSalt(10);
    const hasPassword = bcrypt.hashSync(validation.password, salt);
    // chek if password is not generate
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
    res.status(200).json({
      status: true,
      message: "user has been created",
      newUser,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// find by params id ------------------------------------
exports.getUserById = async (req, res, next) => {
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
        message: `user with this is not avalilble`,
      });
    }
    logger.info(`user find sucessfully`);
    res.status(200).json({
      status: true,
      message: "user deatails is ",
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

// soft delete find by params id and update
exports.softDelete = async (req, res, next) => {
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
    // send the responce
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
// revert soft deleted user
exports.revertUser = async (req, res, next) => {
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
    // send the responce
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
