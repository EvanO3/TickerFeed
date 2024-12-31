
const {Schema} = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true }, //links the id with the ID on clerk
    firstname: { type: String, required: true, maxLength: 25 },
    lastname: { type: String, required: true, maxLength: 25 },
    email: { type: String, required: true, unique: true },
    //password length will be validated in utils
   // password: { type: String, required: true },
    resumes: [
      {
        fileUri: String,
        uploadedAt: { type: Date, default: Date.now() },
      },
    ],
    education: [
      {
        description: String,
        end_date: String,
        institute: String,
        location: String,
        start_date: String,
        title: String,
      },
    ],
    skills: [String],
    experience: [
      {
        company: String,
        description: String,
        end_date: String,
        location: String,
        start_date: String,
        title: String,
      },
    ],
    Languages: [String],
    certificates: [String],
    date_of_birth: { type: Date },
    //add roles if payment is involved
  },
  { timestamps: true }
);


const User =mongoose.model('User', userSchema)
module.exports = User;