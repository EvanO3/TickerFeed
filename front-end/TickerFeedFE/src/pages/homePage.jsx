import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import { Search } from "lucide-react";
import Header from "../components/header"
const BackendURL = process.env.REACT_APP_BackendURL;
const Home = () => {
  const [news, setNews] = useState([])
  const[watchlist, setWatchList]= useState([]);
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading]= useState(false)
  const fetchNews = async()=>{
    
    try {
      console.log("Fetching news");
      setIsLoading(true);
      const response = await fetch(
        `${BackendURL}/api/news?stockSymbol=${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
         if (data && Array.isArray(data.data)) {
           setNews(data.data); // Set the news state with the array from 'data'
         } else {
           console.error("Unexpected data format", data);
           setNews([]);
         }
      } else {
        console.error("Failed to fetch news");
        setNews([]);
      }
    } catch (err) {
      console.error("error occurred", err);
      setNews([]);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const getWatchList = async()=>{
   
    try{
      const response = await fetch(`${BackendURL}/api/stocks/watchlist`, {
        method: "GET",
        credentials: "include",
      });
      if(response.ok){
        const data = await response.json()
        setWatchList(data)
      }else{
        console.error("Failed to fetch watchList")
         setWatchList([]);
      }
    }catch(err){
      console.error('error occurred', err)
      setWatchList([]);
    }
  };
useEffect(()=>{
  
getWatchList();

},[])


  return (
    <>
      <Header />
      <div className="home-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for stocks, news, companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={fetchNews}>
            <Search size={20} />
          </button>
        </div>

        <div className="content-wrapper">
          {/* News Section */}
          <div className="news-section">
            <h2>News</h2>
            {isLoading ? ( // Show loading indicator
              <p>Loading news...</p>
            ) : news.length > 0 ? (
              <ul>
                {news.map((article, index) => (
                  <li key={index} className="news-item">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{article.title}</strong>
                    </a>
                    <p>{article.description}</p>
                    <p>
                      <small>
                        By {article.author || "Unknown"} |{" "}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </small>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No news found. Try searching for a specific stock.</p>
            )}
          </div>

          {/* Watchlist Section */}
          <div className="watchlist-section">
            <h2>Your Watchlist</h2>
            {watchlist.length > 0 ? (
              <ul>
                {watchlist.map((stock, index) => (
                  <li key={index} className="watchlist-item">
                    <p>
                      <strong>{stock.tickerSymbol}</strong> -{" "}
                      {stock.companyName} (${stock.price})
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your watchlist is empty. Add some stocks to get started!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
