
const {Schema} = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, maxLength: 25, trim: true },
    lastname: { type: String, required: true, maxLength: 25, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    //password length will be validated in utils
    password: { type: String, required: true },
    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stock", unique: true}],
  },
  { timestamps: true }
);


const User =mongoose.model('User', userSchema)
module.exports = User;