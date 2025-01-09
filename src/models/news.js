const mongoose = require("mongoose")
const newsSchema = new mongoose.Schema({
  newsArticles: [
    { tickerSymbol: { type: String,required: true,trim: true, uppercase: true},
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      author: { type: String, trim: true },
      url: { type: String, match: /^https?:\/\// },
      publishedAt: { type: Date, required: true },
    },
  ],
});
newsSchema.index({ tickerSymbol: 1, publishedAt: -1 }); //for faster indexing
const News = mongoose.model('News',newsSchema)


module.exports=News