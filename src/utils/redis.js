const redis = require("redis")
require('dotenv').config()


const client = redis.createClient(process.env.redis_client);
client.on('error',(error)=>{
    console.log(`error occurred ${error}`)
})


client.connect().then(()=>{
    console.log("Redis is connected")
}).catch((err)=>{
    console.log(`Error occured ${err}`)
})

module.exports=client;