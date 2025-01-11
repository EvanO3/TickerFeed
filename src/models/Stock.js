const mongoose = require("mongoose")

const stockSchema = new mongoose.Schema({
  tickerSymbol: { type: String, required: true, uppercase:true},
  companyName: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  marketCap: { type: Number },
  price: { type: Number },
  dailyChange: { type: Number, default: 0 },
});

const Stocks = mongoose.model('Stock', stockSchema);
stockSchema.index({ tickerSymbol: 1 }, { unique: true });

module.exports= Stocks