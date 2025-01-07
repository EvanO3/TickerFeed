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
   
      const response = await axios.get(
        `https://api.polygon.io/v3/reference/tickers/${stockSymbol}`,
        {
          params: {
            apikey: process.env.polygon_key,
          },
        }
      );
  
     
    

  }catch(err){
    console.error(err)
    return res.status(500).json({msg:'Internal server error'})
  }
}


module.exports = { getStockInfo };

