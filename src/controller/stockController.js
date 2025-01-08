const axios = require("axios")
const Stocks = require("../models/Stock")
require("dotenv").config()

const getStockInfo = async (req,res)=>{
  try{
    //user must pass a stock into the query params in order to get the stock information
    const {stockSymbol} = req.query
    if (!stockSymbol) {
      return res.status(400).json({ msg: "Stock Symbol Required" });
    }
    //const stockData = await Stocks.findOne({tickerSymbol:stockSymbol})
   
      const stockResponse = await axios.get(
        `https://api.polygon.io/v3/reference/tickers/${stockSymbol}`,
        {
          params: {
            apikey: process.env.polygon_key,
          },
        }

    )

    const newsResponse = await axios.get(
        `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=5`,
        {
            params:{
                apikey:process.env.polygon_key
            }
        }
        

    );

    console.log(newsResponse.data)
    const StockData={
        tickerSymbol:stockSymbol,
        companyName:stockResponse.data.results.name,
        sector:'',
        industry:'',
        marketCap:stockResponse.data.results.market_cap,
        price:0, // price will be set using vantage api
        newsArticles:newsResponse.data.results.map(article=>({
            title:article.title,
            description:article.description,
            author:article.author,
            url:article.article_url,
            publishedAt:new Date(article.published_utc)
            
        }))
    }

    const stock = await Stocks.findOneAndUpdate(
        {tickerSymbol:stockSymbol},
        StockData,
        {new:true,upsert:true}

    );

    return res.status(200).json({data:stock})
      
  
     
    

  }catch(err){
    console.error(err)
    return res.status(500).json({msg:'Internal server error'})
  }
}


module.exports = { getStockInfo };

