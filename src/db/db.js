const mongoose = require("mongoose")
require("dotenv").config();
const connectDB = async()=>{
    try{
        await mongoose
          .connect(process.env.MONGODB_URI)
          .then(() => console.log("Connected to DB"))
          .catch((err) => {console.error(`Error: ${err}`);
          //process.exit will exit the connect if it fails to connect to the DB
            process.exit(1);
        });

    }catch(error){
        console.error('Error connecting to DB: ',error)
    }

}

module.exports= connectDB