const passport = require("passport")
const {Strategy} = require("passport-local")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const localStategy =passport.use(
    new Strategy({usernameField:"email"}, async(email, password, done)=>{
        try{
            const user =await User.findOne({email:email});
            if(!user){
                return done(null, false, {message:"User not found"})
            }
            //checking if the password is valid
            const isPasswordValid = await bcrypt.compare(password,user.password)
            if(!isPasswordValid){return done(null, false, { message: "Incorrect username or" });}

            return done(null, user)

        }catch(error){
            console.error("Error found: ", error)
        }
    })
);

module.exports ={localStategy}
