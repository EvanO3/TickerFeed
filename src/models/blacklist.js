const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate tokens
  },
  expiresAt: {
    type: Date,
    required: true, // Set the expiration time for cleanup
  },
});

const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistSchema);

module.exports = BlacklistedToken;
