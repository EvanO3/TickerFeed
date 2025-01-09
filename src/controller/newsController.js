    const newsResponse = await polygonlimiter.schedule(()=>axios.get(
        `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=5`,
        {
            params:{
                apikey:process.env.polygon_key
            }
        }
));


// this will be used for the news data

//  newsArticles: newsResponse.data.results.map((article) => ({
//         title: article.title,
//         description: article.description,
//         author: article.author,
//         url: article.article_url,
//         publishedAt: new Date(article.published_utc),
//       })),