const User = require("../models/user");
const { validationSchema} = require('../middleware/validations');
const bcrypt = require("bcrypt");


// get all user one user by name and get all user--------------------------------------------------------
exports.getAllUser = async (req, res, next) => {
  const query = req.query.name;
  try {
    const user = query
      ? await User.findOne({ userName: query })
      : await User.find();
    res.status(200).json({
        status:true,
        message:'All user',
        user,
    });
  } catch (err) {
    res.status(400).json({
        status:false,
        message:err.message,
    });
  }
};

// get all verified users -------------------------------------------------------------------------------
exports.getAllVerifiedUser = async (req, res, next) => {
  const query = req.query.verified;
  try {
    const user = await User.find({isVerified:query});
    if(!user){
        return res.status(400).json({
            status:false,
            message:'user is not fonds'
        })
    }
    res.status(200).json({
        status:true,
        message:'all verified user',
        user,
    })
    
  } catch (err) {
    res.status(400).json(err.message);
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
        res.status(200).json({
            status:true,
            message:'update user ',
            updatedUser,
        });
      } catch (error) {
        console.log(error.message)
        res.status(404).json({
            status:false,
            message:error.message
        });
      }
    };
// create user -----------------------------------------------------------------------------------------
exports.createUser =async (req,res,next)=>{
    
    try {
        const validation = await validationSchema.validateAsync(req.body);
        // if user doesExist
        console.log(validation.email);
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
        res.status(200).json({
            status:true,
            message:'user has been created',
            newUser,
        })
    }catch(err){
        console.log(err.message);
        res.status(400).json({
            status:false,
            message:err.message
        })
    }
}

// find by params id ------------------------------------
exports.getUserById =async (req,res,next)=>{
    const paramId = req.params.name;
    try {
      const user = await User.findOne({_id: paramId })
      res.status(200).json({
          status:true,
          message:'All user',
          user,
      });
    } catch (err) {
      res.status(400).json({
          status:false,
          message:err.message,
      });
    }
}