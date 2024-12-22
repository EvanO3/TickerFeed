const User = require("../models/user.js")
const bcrypt = require("bcryptjs")
const {checkSchema} = require("express-validator")
const { userValidator } = require("../utils/userValidation.js")

//This controller route creates the user and hash's the password before storing into DB

const createUser =  async (req, res)=>{
    //first check to see if the email already exits
    

    try{
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser)
            {res.status(400).send({msg:"User already exits with that email"})
    }
    const hashedPashword = await bcrypt.hash(req.body.password,10)

    const newUser = new User({
        name: req.body.name,
        email:req.body.email,
        password: hashedPashword,
        date_of_birth:req.body.date_of_birth

    })

    await newUser.save();
    res.status(201).send({msg:"User has been saved"})

    }catch(error){
        console.error(`Error: ${error}`)
        res.status(500).send({msg:"Server Error"})
    }

}



module.exports = {
  createUser
};