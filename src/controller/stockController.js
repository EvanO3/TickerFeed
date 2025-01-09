const axios = require("axios")
const Stocks = require("../models/Stock")
require("dotenv").config()
const Bottleneck = require("bottleneck")
const redis = require("../utils/redis");

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

 await redis.setEx(stockSymbol, 300, JSON.stringify(StockData));

    return res.status(200).json({data:stock})
      
  
     
    

  }catch(err){
    console.error(err)
    return res.status(500).json({msg:'Internal server error'})
  }
}

//User to be able to add a stock to their watch list

//view stock news


/**
 * routes for the news controller
 */
//news/top-headlines (fetch top stock-related headlines).
//news/search (search news by ticker symbol).
//user/stocks (add/remove favorite stocks).
//user/news-feed


/**
 * 

2. Get Stock News
Route: GET /api/stocks/news
Description: Retrieves the latest news for a specific stock symbol.
Parameters: stockSymbol (query parameter)
Example: /api/stocks/news?stockSymbol=AAPL


3. Get Stock Historical Data
Route: GET /api/stocks/history
Description: Retrieves historical stock price data (e.g., daily, weekly, monthly).
Parameters: stockSymbol, startDate, endDate (query parameters)
Example: /api/stocks/history?stockSymbol=AAPL&startDate=2023-01-01&endDate=2023-12-31
4. Get Market Summary
Route: GET /api/stocks/market-summary
Description: Retrieves a summary of the stock market, including indices like S&P 500, NASDAQ, etc.
Example: /api/stocks/market-summary
5. Get Stock Technical Indicators
Route: GET /api/stocks/indicators
Description: Retrieves technical indicators (e.g., RSI, MACD) for a specific stock symbol.
Parameters: stockSymbol, indicator (query parameters)
Example: /api/stocks/indicators?stockSymbol=AAPL&indicator=RSI
6. Get Stock's Current Price
Route: GET /api/stocks/price
Description: Retrieves the current price of a specific stock symbol.
Parameters: stockSymbol (query parameter)
Example: /api/stocks/price?stockSymbol=AAPL
7. Search for Stocks
Route: GET /api/stocks/search
Description: Search for stocks by company name or symbol.
Parameters: query (query parameter, could be part of the stock symbol or company name)
Example: /api/stocks/search?query=apple
8. Add Stock to Watchlist
Route: POST /api/stocks/watchlist
Description: Adds a stock to the user's watchlist.
Body: { stockSymbol: 'AAPL' }
Example: POST /api/stocks/watchlist
9. Get User's Watchlist
Route: GET /api/stocks/watchlist
Description: Retrieves all stocks on the user's watchlist.
Example: /api/stocks/watchlist
10. Remove Stock from Watchlist
Route: DELETE /api/stocks/watchlist
Description: Removes a stock from the user's watchlist.
Body: { stockSymbol: 'AAPL' }
Example: DELETE /api/stocks/watchlist
11. Get Stock's Latest Dividend Data
Route: GET /api/stocks/dividends
Description: Retrieves dividend information for a specific stock symbol.
Parameters: stockSymbol (query parameter)
Example: /api/stocks/dividends?stockSymbol=AAPL
12. Get Stock's Earnings Report
 */
module.exports = { getStockInfo };

