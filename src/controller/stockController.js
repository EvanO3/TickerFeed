const axios = require("axios")
const Stocks = require("../models/Stock")
require("dotenv").config()
const Bottleneck = require("bottleneck")
const redis = require("../utils/redis");
const User = require("../models/user")
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

// when stock info gets returned add a way to also add news articles by using News.FindOne

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
        console.log(`Returned from redis ${cachedData}`)
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
     
    };

    const stock = await Stocks.findOneAndUpdate(
        {tickerSymbol:stockSymbol},
        StockData,
        {new:true,upsert:true}

    );
  


 await redis.setEx(stockSymbol, 300, JSON.stringify(StockData));

    return res.status(200).json({data:stock})
      
  
     
    

  }catch(err){
    console.error(err)
    return res.status(500).json({msg:'Internal server error'})
  }
}





//User to be able to add a stock to their watch list
const addToWatchList = async(req,res)=>{
    // check if they gave a stock in their req
    const {stockSymbol} = req.body
    const userId= req.user._id

   try{
       if(!stockSymbol){
           return res.status(400).json({msg:"Stock symbol required"})
       }

       const stockData = await Stocks.findOne({tickerSymbol:stockSymbol})
 
       if(!stockData){
        return res.status(400).json({msg:"Stock Symbol not available"})
       }
       //if a stock symbol was provided

  await User.updateOne(
         { _id: userId },
         { $addToSet: {watchList: stockData._id } }
       );

           
       return res.status(200).json({msg:`Stock ${stockSymbol} added to watchList`})
   }catch(err){
    console.log(`Error has occurred ${err}`)
   }
   
  
}

const getWatchList= async (req,res)=>{
    const userId = req.user._id;

    try{
        const UserwatchList = await User.findById({_id:userId}).populate('watchList')
       return res.status(200).json({ watchList: UserwatchList.watchList });
    }catch(err){
       console.log(`Error has occurred ${err}`)
       return res.status(500).json({msg:"Internal server error"})
    }
}


const removeFromWatchList= async(req, res)=>{
    const userId = req.user._id
    const {stockSymbol}= req.body

    if(!stockSymbol){
       return res.status(400).json({msg:"No Ticker symbol provided"})
    }

    try{
            const stock_id = await Stocks.findOne({tickerSymbol:stockSymbol})
            console.log(stock_id._id)
            const Userwatchlist = await User.findByIdAndUpdate(
              { _id: userId },
              { $pull: { watchList: stock_id._id } }
            );
            return res.status(200).json({ data: Userwatchlist.watchList});

           
    }catch(error){
        console.log(`Error found ${error}`)
        return res.status(500).json({msg:"Internal server error"})
    }
}


const getEarningReports= async(req,res)=>{
    try{
        const {stockSymbol} = req.query
        if(!stockSymbol){
            return res.status(400).json({msg:"Ticker symbol not provided"})
        }

        const cachedData = await redis.get(`Earnings:${stockSymbol}`);
        if(cachedData){
            console.log(`Sending cached data ${cachedData}`)

            return res.status(200).json({data: JSON.parse(cachedData)})
        }

        const response = await limiter.schedule(()=> axios.get(`https://www.alphavantage.co/query?`, {
          params: {
            function: "EARNINGS",
            symbol:stockSymbol,
            apikey: process.env.vantage_api_key,
          },
        }));


        const stockEarnings = response.data.quarterlyEarnings
        console.log(stockEarnings)
        await redis.setEx(`Earnings:${stockSymbol}`, 300, JSON.stringify(stockEarnings));
        // console.log(response.data)
        return res.status(200).json({ data: stockEarnings });
    }catch(error){
        console.log(`Error found ${error}`)
        return res.status(500).json({msg:"Internal Server Error"})
    }
}


const getCurrentPrice = async (req,res)=>{
    const {stockSymbol}=req.query
    if(!stockSymbol){
       return res.status(400).json({msg:"Stock Symbol Required"})
    }

    const cachedData = await redis.get(`StockPrice:${stockSymbol}`);
    if(cachedData){
       return res.status(200).json({data:cachedData})
    }
    try{
            const stock = await Stocks.findOne({tickerSymbol:stockSymbol})

            if(!stock){
                res.status(400).json({ msg: `Stock ${stockSymbol} not found` });
            }
            const stockPrice = stock.price

            await redis.setEx(`StockPrice:${stockSymbol}`, 300, JSON.stringify(stockPrice));
          return res
            .status(200)
            .json({ stockSymbol, currentPrice: stockPrice });
    }catch(error){
        console.log('Error :', error)
       return res.status(500).json({msg:"Internal server error"})
    }
}



const getStockHistory = async (req,res)=>{
    const {stockSymbol, startDate, endDate} = req.query

    try{
        if(!stockSymbol){
            return res.status(400).json({msg:"Missing stock symbol"})
        }
    
       const  cachedData = await redis.get(`StockHistory:${stockSymbol}`);
       if(cachedData){
        console.log('sending cached data')
        return res.status(200).json({data:cachedData})
       }
         const response = await limiter.schedule(() =>
           axios.get("https://www.alphavantage.co/query?", {
             params: {
               function: "TIME_SERIES_DAILY",
               symbol: stockSymbol,
               apikey: process.env.vantage_api_key,
             },
           })
         );
    
         const timeSeries = response.data["Time Series (Daily)"];
    
        if(startDate && endDate){
            const start= new Date(startDate)
            const end = new Date(endDate)
    
            //filter data by date range
    
            const filteredData = Object.keys(timeSeries)
            .filter(date=>{
                const currentDate = new Date(date);
                return currentDate >= start && currentDate <= end
            })
            .reduce((result,date)=>{
                result[date]=timeSeries[date];
                return result;
            },{})
    
            
            await redis.setEx(`StockHistory:${stockSymbol}`, 300, JSON.stringify(filteredData))
            return res.status(200).json({data:filteredData})   
        }
         await redis.setEx(
           `StockHistory:${stockSymbol}`,
           300,
           JSON.stringify(timeSeries)
         );
    
        return res.status(200).json({data:timeSeries})

    }catch(err){
        console.log(`Error occured ${err}`)
        return res.status(500).json({msg:"Internal server error"})
    }
}

/**
 * 
 
 

4. Get Market Summary
Route: GET /api/stocks/market-summary
Description: Retrieves a summary of the stock market, including indices like S&P 500, NASDAQ, etc.
Example: /api/stocks/market-summary

5. Get Stock Technical Indicators
Route: GET /api/stocks/indicators
Description: Retrieves technical indicators (e.g., RSI, MACD) for a specific stock symbol.
Parameters: stockSymbol, indicator (query parameters)
Example: /api/stocks/indicators?stockSymbol=AAPL&indicator=RSI






11. Get Stock's Latest Dividend Data
Route: GET /api/stocks/dividends
Description: Retrieves dividend information for a specific stock symbol.
Parameters: stockSymbol (query parameter)
Example: /api/stocks/dividends?stockSymbol=AAPL



 */
module.exports = {
  getStockInfo,
  addToWatchList,
  getWatchList,
  removeFromWatchList,
  getEarningReports,
  getCurrentPrice,
  getStockHistory,
};

