const User = require("../models/user")
const fs = require("fs")
const pdfParse = require("pdf-parse")
const resumeUpload = async(req,res)=>{
    try{
            if(!req.file) {return res.status(404).json({msg:"No File being uploaded"})}
               const userId = req.userId;
               const filePath = req.file.path
               const data = await extractData(filePath)
               console.log(data)
    
         const updatedUser=   await  User.findByIdAndUpdate(userId,
            {$push:{resumes:{fileUri:filePath}}},
                {new:true})
        if(!updatedUser){
            return res.status(404).json({msg:"User not found"})
        }else{
            res.status(200).json({msg:"Image uploaded successfully",
                user:updatedUser
            })
        }
    
        }  catch(error){
            console.error(error)
            res.status(500).json({msg:"Internal Server Error"})
        }
}

//helper function to parse the information from the PDF

async function extractData(filePath){
    //data will be extracted using a regex to find relevant skills and experience
   
    
    
    let dataBuffer = fs.readFileSync(filePath)
    const data = await pdfParse(dataBuffer);
    const resumeText = data.text;
    const filteredResumeText= preProcessText(resumeText);
    const filteredSkills = extractSkills(filteredResumeText);
    const filteredExperience = extractExperience(filteredResumeText)
    const cleanedSkill = cleanSkills(filteredSkills)
    const cleanedExp = cleanExperience(filteredExperience)

    console.log(JSON.stringify({ cleanedSkill, filteredExperience }, null, 2));
    //return { cleanedSkill, cleanedExperience };
    

    
    // let match;
    // while((match= sectionRegx.exec(resumeText))!==null){
    //     console.log(`${match[1].toUpperCase()} Section:`)
    //     console.log(`${match[2].trim()}`);
    //     console.log("-----------------------------------------------")
    // }
  
          

    

}


function preProcessText(rawText){
const normalizedText = rawText
  .replace(/\r\n|\r|\n/g, "\n")
  .replace(/[ \t]+/g, " ")
  .trim();
  return normalizedText;


}

function extractSkills(text) {
  const match = text.match(
    /(?:^|\n)(skills|skills & interests|technical skills|Certifications)[\s:]*\n([\s\S]*?)(?=\n(?:[A-Z][A-Z\s]*:|[A-Z][A-Z\s]*\n|$))/i
  );
   console.log("Match here",match);
  return match ? match[2].trim() : "No skills found.";
}



function extractExperience (text){// Match the experience section using regex
  const match = text.match(
    /(experience|work experience|professional experience)[\s:–-]*([\s\S]*?)(?=\n{2,}|skills|education|projects|summary|certifications|interests|achievements)/i
  );
  return match ? match[2].trim() : "No experience found.";}



  //helper functions to clearn the information when processed


  function cleanSkills(skillsText) {
    return skillsText
      .split("\n") // Split by line breaks
      .map((line) => line.replace(/•\s*/, "").trim()) // Remove bullets and trim whitespace
      .filter((line) => line); // Remove empty lines
  }


  function cleanExperience(experienceText) {
    const jobRegex =
      /(.*?)\s*–\s*(.*?)(?=\n{2,}|\b(education|skills|projects|certifications|interests)\b|$)/g;
    const experiences = [];
    let match;

    while ((match = jobRegex.exec(experienceText)) !== null) {
      const jobDescription = match[0].trim();
      const companyPosition = match[1].trim();
      const dateRange = match[2].trim();

      // Replace the bullet points (•) with line breaks and remove the bullets
      const formattedDescription = jobDescription
        .replace(/•\s*/g, "") // Remove the bullet point
        .replace(/\n/g, " \n") // Ensure each line breaks with a space
        .trim();

      // Combine company position, date range, and job description (responsibilities)
      experiences.push(
        `${companyPosition} ${dateRange} \n${formattedDescription}`
      );
    }

    // Join all experiences into a single string, separating with line breaks between each job
    return experiences.join("\n") || "No experience found.";
  }
  
module.exports={resumeUpload};