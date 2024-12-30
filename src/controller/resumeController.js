const User = require("../models/user")
const fs = require("fs")
const axios =require("axios")
const FormData = require("form-data");
require("dotenv").config()

/** Add Rate limiting for all endpoints, also add rate limiting for outside API Calls, i.e to Extraction API */
const resumeUpload = async(req,res)=>{
    try{
      if (!req.file) {
        return res.status(404).json({ msg: "No File being uploaded" });
      }
      const userId = req.userId;
      const filePath = req.file.path;
   
      let fileInformation = await uploadFiles(
        process.env.Extracta_ai_API,
        process.env.Extraction_ID,
        [filePath]
      );

      console.log("Waiting for 60 seconds to allow for processing...")

      await new Promise((resolve)=>setTimeout(resolve, 60000))
      let usersInformation = await getBatchResults(
        process.env.Extracta_ai_API,
        process.env.Extraction_ID,
        fileInformation.batchId
      );



      const firstFileResult = usersInformation.files[0]?.result || {};
      const education = firstFileResult.education || [];
      const skills = firstFileResult.skills || [];
      const languages = firstFileResult.languages || [];
      const experience = firstFileResult.work_experience || [];
      const certificates = firstFileResult.certificates || [];

         console.log("Users information: ", usersInformation)
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: { resumes: { fileUri: filePath } },
          $addToSet: {
            education: { $each: education},
            skills: { $each: skills },
            Languages: { $each: languages },
            experience: {
              $each: experience
            },
            certificates: {
              $each:certificates
            },
          },
        },

        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.status(200).json({
        msg: "Image uploaded successfully",
        user: updatedUser,
      });
    }  catch(error){
            console.error(error)
            res.status(500).json({msg:"Internal Server Error"})
        }
       
}


const uploadFiles = async (token, extractionId, files, batchId = null)=>{
  const url = process.env.extracta_url;
  let formData = new FormData();

  formData.append("extractionId", extractionId);

  if (batchId) {
    formData.append("batchId", batchId);
  }

  //appending the files to the batch for processing

  files.forEach((file) => {
    formData.append("files", fs.createReadStream(file));
  });

  //add rate limiting for this api request
  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

  return response.data
  } catch (error) {
    console.error("Full error:", error);
    throw error.response
      ? error.response.data
      : new Error(`Request failed: ${error.message}`);
  }
}

/**
 * gets the results from the uploaded file for the user, it incorporates polling so it periodically
 * checks to see if the information has been returned
**/


    async function getBatchResults(token, extractionId, batchId, fileId=null) {
      const url = process.env.extract_results_url;
     

     
    
      try {
        // Constructing the request payload
        const payload = {
          extractionId,
          batchId,
        };

        // Adding fileId to the payload if provided
        if (fileId) {
          payload.fileId = fileId;
        }
        
            //add rate limiting for this api request
        const response = await axios.post(url, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });


        
         // Handling response
        console.log(response.data.files[0].result)
        return response.data; // Directly return the parsed JSON 
    
      } catch (error) {
        // Handling errors
        throw error.response
          ? error.response.data
          : new Error("An unknown error occurred");
      }
     
    }


    




module.exports={resumeUpload, uploadFiles};