const User = require("../models/user")

const resumeUpload = async(req,res)=>{
    try{
            if(!req.file) {return res.status(404).json({msg:"No File being uploaded"})}
               const userId = req.userId;
               const filePath = req.file.path
            
         const updatedUser=   await  User.findByIdAndUpdate(userId,
            {$push:{resumes:{fileUri:filePath}}},
                {new:true})
        if(!updatedUser){
            return res.status(404).json({msg:"User not found"})
        }else{
            res.status(200).json({msg:"Image uploaded successfully",
                user:updatedUser
            })
        }
    
        }  catch(error){
            console.error(error)
            res.status(500).json({msg:"Internal Server Error"})
        }
}

module.exports={resumeUpload};