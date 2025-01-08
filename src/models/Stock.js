const mongoose = require("mongoose")

const stockSchema = new mongoose.Schema({
  tickerSymbol: { type: String, required: true },
  companyName: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  marketCap: { type: Number },
  price: { type: Number },
  dailyChange: { type: Number, default: 0 },
  newsArticles: [
    {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      author: { type: String, trim: true },
      url: { type: String, match: /^https?:\/\// },
      publishedAt: { type: Date, required: true },
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
});

const Stocks = mongoose.model('Stock', stockSchema);
stockSchema.index({ tickerSymbol: 1 }, { unique: true });

module.exports= Stocks