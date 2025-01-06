const mongoose = require("mongoose")

const stockSchema = new mongoose.Schema({
    tickerSymbol:{type:String, required:true},
    companyName:{type:String, required:true},
    sector:{type:String},
    industry:{type:String},
    marketCap:{type:Number},
    price:{type:Number},
    dailyChange:{type:Number, default:0},
    newsArticles:[{
        title:{type:String},
        url:{type:String},
        publishedAt:{type:String}
    }],
    lastUpdated:{type:Date, default:Date.now()}



})

const Stocks = mongoose.model('Stock', stockSchema);
module.exports= Stocks