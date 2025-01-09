const axios = require("axios")
const Stocks = require("../models/Stock")
require("dotenv").config()
const Bottleneck = require("bottleneck")
const redis = require("../utils/redis")

const limiter = new Bottleneck({
  reservoir: 25,
  reservoirRefreshInterval: 3600000,
  reservoirRefreshAmount: 25,
  minTime: 144000,
});


const polygonlimiter = new Bottleneck({
  reservoir: 5,
  reservoirRefreshInterval: 300000,
  reservoirRefreshAmount: 5,
  minTime: 60000,
});
const getStockInfo = async (req,res)=>{
  try{
    //user must pass a stock into the query params in order to get the stock information
    const {stockSymbol} = req.query
    if (!stockSymbol) {
      return res.status(400).json({ msg: "Stock Symbol Required" });
    }
    //const stockData = await Stocks.findOne({tickerSymbol:stockSymbol})
    //checks to see if theres data on that stocksymbol, if so return it, if not then make api requests
     const cachedData = await redis.get(stockSymbol);
     if (cachedData) {
       return res.status(200).json({ data: JSON.parse(cachedData) });
     }

      const stockResponse = await polygonlimiter.schedule(() =>
        axios.get(
          `https://api.polygon.io/v3/reference/tickers/${stockSymbol}`,
          {
            params: {
              apikey: process.env.polygon_key,
            },
          }
        )
      );

    const newsResponse = await polygonlimiter.schedule(()=>axios.get(
        `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=5`,
        {
            params:{
                apikey:process.env.polygon_key
            }
        }
));


const priceResponse = await limiter.schedule(()=> axios.get(`https://www.alphavantage.co/query?`, {
  params: {
    function: "GLOBAL_QUOTE",
    symbol: stockSymbol,
    apikey: process.env.vantage_api_key,
  },
}));

console.log(priceResponse.data)
    const StockData = {
      tickerSymbol: stockSymbol,
      companyName: stockResponse.data.results.name,
      sector: "",
      industry: "",
      marketCap: stockResponse.data.results.market_cap,
      price: priceResponse.data['Global Quote']['05. price'], // price will be set using vantage api
      newsArticles: newsResponse.data.results.map((article) => ({
        title: article.title,
        description: article.description,
        author: article.author,
        url: article.article_url,
        publishedAt: new Date(article.published_utc),
      })),
    };

    const stock = await Stocks.findOneAndUpdate(
        {tickerSymbol:stockSymbol},
        StockData,
        {new:true,upsert:true}

    );

 redis.setex(stockSymbol, 300, JSON.stringify(StockData));

    return res.status(200).json({data:stock})
      
  
     
    

  }catch(err){
    console.error(err)
    return res.status(500).json({msg:'Internal server error'})
  }
}


module.exports = { getStockInfo };

