
/** 
 * On logout the users Session token will be invalidated(blackListed)
*/
const mongoose = require("mongoose")
const blackListSchema = new mongoose.Schema({

    token:{
        type:String,
        required:true,
        ref:"User",
    },
},
{timestamps:true}
)

 module.exports=mongoose.model("blackList", blackListSchema)