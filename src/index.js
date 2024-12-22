const express = require('express');
require("dotenv").config();
const routes = require("./Routes/Users.js")
const app = express();
//for production change the OR
const PORT = process.env.PORT || 4000

app.use(routes)
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})