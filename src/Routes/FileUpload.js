const Router = require("express")
const router = Router();

const upload = require("../utils/multer.js")
const User = require("../models/user.js")
const auth = require("../utils/Auth.js")
//post reques to handle router to uploading files

router.post("/uploadResume", auth.authenticate, upload.single('file'), async (req,res)=>{
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
})

module.exports=router