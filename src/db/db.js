const mongoose = require("mongoose")
require("dotenv").config();
const connectDB = async()=>{
    try{
        await mongoose
          .connect(process.env.MONGODB_URI)
          .then(() => console.log("Connected to DB"))
          .catch((err) => {console.error(`Error: ${err.message}`);
          
        });

    }catch(error){
        console.error('Error connecting to DB: ',error)
    }

}

module.exports= connectDB