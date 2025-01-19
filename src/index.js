const express = require('express');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const routes = require("./Routes/Routes");
const connectDB = require("./db/db.js");
const rateLimit = require('express-rate-limit')
const slowDown =require("express-slow-down")
const cors = require("cors")


const app = express();
// app.set('trust proxy', 1); // trust first proxy

//Before moving to prod, change the limtor here to 20 and then the more expensive ones like external api calls
//limit to 6 in the router

/**
 * limiter, this will limit client side requests so if too many requests come from a single IP it will limit it
 *  windowMs: time in Ms at which the rate limit will apply
 * max: the max amount of requests before the limit applies
**/

const limiter = rateLimit({

    windowMs:10*60*1000,
    max:20
})

/**
 * This will slow down requests after 3 requests to the endpoint have been made, to slow the load on the server
 *  windowMs: time in Ms at which the rate limit will apply
 * delayAfter: this will delay the response after # of requests
 * delayMS:sepcifies how long the delay will be in Ms
 
**/
const speedLimiter = slowDown({
    windowMs:10*60*1000,
    delayAfter:3,
    delayMs:()=>2000
})
// middleware to allow parsing json bodies
app.use(express.json())
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.front_end_url,
    credentials: true,
  })
);
app.use(limiter)
app.use(speedLimiter)
app.use(routes)
//for cookies

//this string will connect to the mongoDB, if error occurs it logs it
connectDB();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

//for production change the OR
const PORT = process.env.PORT || ""


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
