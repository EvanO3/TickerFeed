const News = require("../models/news")
const axios = require("axios")
const Bottleneck = require("bottleneck");
const redis = require("../utils/redis");
require("dotenv").config();


const polygonlimiter = new Bottleneck({
  reservoir: 5,
  reservoirRefreshInterval: 300000,
  reservoirRefreshAmount: 5,
  minTime: 60000,
});

const getStockNew = async(req, res)=>{
try{
    const { stockSymbol } = req.query;
    if (!stockSymbol) {
      return res.status(400).json({ msg: "No stock symbol found" });
    }

    const cachedData = await redis.get(stockSymbol)
    if(cachedData){
        console.log("Sending cached data")
        return res.status(200).json({data:JSON.parse(cachedData)})
    }

    const newsResponse = await polygonlimiter.schedule(() =>
      axios.get(
        `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=10`,
        {
          params: {
            apikey: process.env.polygon_key,
          },
        }
      )
    );

    const newsArticles = newsResponse.data.results.map((article)=>({
        title:article.title,
        description:article.description,
        author:article.author,
        url:article.article_url,
        publishedAt: new Date(article.published_utc),

    }));

    await News.findOneAndUpdate(
  { tickerSymbol: stockSymbol },
  { newsArticles: newsArticles },
  { upsert: true, new: true }
);
    

    

      
  
     await redis.setEx(stockSymbol, 300, JSON.stringify(newsArticles));

    res.status(200).json({data:newsArticles})



}catch(err){
    console.log(`Error occured ${err}`)
    return res.status(500).json({msg:'Internal server error'})
}

    }






module.exports = {getStockNew};