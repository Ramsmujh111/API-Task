const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accessToken: {
    type: String,
    default: null,
  },
  isVerifiead: {
    type: Boolean,
    default: false,
  },
  resetLink: {
    type: String,
    default: null,
  },
  deletedAt: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("User", userSchema);
