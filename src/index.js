const express = require('express');
require("dotenv").config();
const routes = require("./Routes/Users.js")
const mongoose = require("mongoose")
const app = express();
//this string will connect to the mongoDB, if error occurs it logs it
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Connected to DB"))
.catch((err)=> console.log(`Error: ${err}`))
//for production change the OR
const PORT = process.env.PORT || 4000

app.use(routes)
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})