const { default: mongoose } = require("mongoose");

//job schema, which will take the search criteria of what the user wants const mongoose = require("mongoose")
const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobDescription: { type: String, required: true },
  responsibilities: [String],
  requiredQualifications: [String],
  datePosted: { type: Date, default: Date.now },
});
  jobSchema.index({ jobTitle: 1, company: 1, location: 1 });
const Job = mongoose.model("jobSchema", jobSchema)
module.exports= Job