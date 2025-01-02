//creating the authentication using a JWT token
// this handles the users authentication
const jwt = require("jsonwebtoken")
const User = require("../models/user.js")

    const authenticate =  async (req,res,next)=>{
        

        const token = req.cookies.SessionID
        //?.split('')[1];
        if(!token){
            return res.status(401).json({msg:"Authentication required"})
        }

        try{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.userId);

            if(!user){
                return res.status(404).json({msg:"User Not found"})
            }
            req.user = user
            req.userId=decodedToken.userId
            next()
        }catch(error){
            console.log(error)
            res.status(401).json({msg:"Invalid Token"})
        }
    }

    module.exports={
        authenticate
    }

