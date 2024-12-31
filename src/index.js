const express = require('express');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const routes = require("./Routes/Routes");
const connectDB = require("./db/db.js");
const { clerkMiddleware, requireAuth } = require("@clerk/express");

const app = express();
//offers authentication for application
app.use(clerkMiddleware())
// middleware to allow parsing json bodies
app.use(express.json())
app.use(cookieParser());
app.use(routes)
//for cookies

//this string will connect to the mongoDB, if error occurs it logs it
connectDB();



//for production change the OR
const PORT = process.env.PORT || ""


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})