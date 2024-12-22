const express = require('express');
require("dotenv").config();
const routes = require("./Routes/Users.js")
const mongoose = require("mongoose")
const app = express();

//allowing to parse json bodies
app.use(express.json())
//this string will connect to the mongoDB, if error occurs it logs it
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {console.error(`Error: ${err}`);
  //process.exit will exit the connect if it fails to connect to the DB
    process.exit(1);
});




//for production change the OR
const PORT = process.env.PORT || ""

app.use(routes)
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})