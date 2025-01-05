// this will have all the routes needed to find a job
const JOB = require("../models/jobs")
const axios = require("axios")
require("dotenv").config();
const retrieveJobs= async(req,res)=>{
    //for now it will be specific jobs, but in future add form and pass info to backend to show users job

    try{
        const response = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${process.env.Adunza_APP_ID}&app_key=${process.env.Adunza_APP_Key}&results_per_page=30&what=IT%20jobs&where=GTA`
        );
            
            if(response){
                //console.log(response.data)
                res.status(200).json({"data:": response.data})

                const jobArray = response.data.results;

                const jobsToInsert = jobArray.map((job) => ({
                  jobTitle: job.title || "N/A",
                  company: job.company.display_name || "N/A",
                  location: job.location.display_name || "N/A",
                  jobDescription: job.description || "N/A",
                  responsibilities: job.contract_time
                    ? [job.contract_time]
                    : [],
                  requiredQualifications: job.category.label
                    ? [job.category.label]
                    : [],
                  job_url: job.redirect_url || "N/A",
                  datePosted: job.created ? new Date(job.created) : new Date(),
                }));
                await JOB.insertMany(jobsToInsert);
            }

           
    }catch(err){
        console.error(`Error occured ${err}`)
        res.status(500).json({msg:'Internal server error'})
    }
    
    
}

module.exports = {retrieveJobs}; 