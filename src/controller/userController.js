const User = require("../models/user.js")
const bcrypt = require("bcryptjs")
const {checkSchema} = require("express-validator")
const { userValidator } = require("../utils/userValidation.js")


const { clerkClient } = require("@clerk/express");
//This controller route creates the user and hash's the password before storing into DB

const createUser =  async (req, res)=>{
    //first check to see if the email already exits
    const {firstname,lastname, email, password, date_of_birth }= req.body;
    
    
    try{
        

        const exisitingUser = await User.findOne({email})

        if(exisitingUser){
            return res.status(400).json({msg:"User already Exists"})
        }
        const newUser = await clerkClient.users.createUser({
            firstname:firstname,
            lastname:lastname,
            emailAddress:[email],
            password,
            publicMetadata:{date_of_birth}
        })

            const user = new User({
              clerkUserId: newUser.id, // Store Clerk's userId
              firstname,
              lastname,
              email,
              date_of_birth,
            });
        await user.save()
res.status(201).send({ msg: "Thank you for registering with us!", userId: newUser.id });
    }catch(error){
         console.error(`Error creating user: ${error}`);
         res.status(500).send({ msg: "Server Error" });
    }
}
/**
 * LOGIN ROUTE NEEDS TO BE FIXED, LOGIN DOES NOT WORK
 */

const login = async (req,res, next)=>{
    const {email, password} = req.body
    
   try {
     //first find the user by their email

     const users = await clerkClient.users.getUserList({
       filters: [
         {
           field: "primary_email_address",
           operator: "equals",
           value: email,
         },
       ],
     });

     // More specific check
     if (!users || !Array.isArray(users) || users.length === 0) {
       return res.status(404).json({ msg: "User not found" });
     }

     // Additional safety check
     const clerkUser = users[0];
     if (!clerkUser || !clerkUser.id) {
       return res
         .status(404)
         .json({ msg: "Invalid user data returned from Clerk" });
     }

    
     await clerkClient.users.verifyPassword({
       userId: clerkUser.id,
       password: password,
     });
     console.log("Clerk User:", clerkUser);

     // Find the user in MongoDB using Clerk's userId
     const user = await User.findOne({ clerkUserId: clerkUser.id });

     // If the user doesn't exist in MongoDB, return an error
     if (!user) {
       return res.status(404).json({ msg: "User not found in our database" });
     }

     // Clerk automatically manages the session, so no need to manually create it.
     // Set session cookies
     const session = await clerkClient.sessions.create({
       userId: clerkUser.id,
     });

     // Send session ID as cookie
     res.cookie("SessionID", session.id, {
       httpOnly: true,
       sameSite: "Strict",
       maxAge: 60 * 60 * 1000, // session expires after 1 hour
     });

     // Respond with success
     res.status(200).json({ msg: "You have successfully logged in" });
   } catch (err) {
   console.error("Full error object:", err);
   console.error(`Error logging in: ${err.message}`);
    res.status(401).json({ msg: "Invalid credentials" });
  }
};



const logout = async (req,res)=>{
    try{
        
        const accessToken =req.cookies.SessionID;
        if(!accessToken){
            res.status(204).send()
        }
        //when use logsout takes token away so they would have to reauthenticate
        await clerkClient.sessions.revokeSession(accessToken);
        res.clearCookie("SessionID",{
            httpOnly:true,
            sameSite:"Strict"
        })

        res.status(200).json({msg:"Successfully logged out"})
    }catch(err){
        console.error(`Error logged ${err}`)
        res.status(500).json({msg:"Internal Server Error"})
    }
}






module.exports = {
  createUser,
  login,
  logout
};