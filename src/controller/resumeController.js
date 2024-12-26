const User = require("../models/user")
const fs = require("fs")
const { type } = require("os")
const { normalize } = require("path")
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
    console.log(data.text)
    const filteredResumeText= preProcessText(resumeText);
    const Skills = extractSkills(filteredResumeText);
    const experience = extractExperience(filteredResumeText)
    return {Skills, experience}
    

    
    // let match;
    // while((match= sectionRegx.exec(resumeText))!==null){
    //     console.log(`${match[1].toUpperCase()} Section:`)
    //     console.log(`${match[2].trim()}`);
    //     console.log("-----------------------------------------------")
    // }
  
          

    

}


function preProcessText(rawText){
const normalizedText = rawText.replace(/\s+/g, " ").trim();
  return normalizedText;


}

function extractSkills(text){
  // Match the skills section using regex
const match = text.match(
 /(?:Certifications|SKILLS)(?:\s*:\s*)?(.*?)(?=OBJECTIVE|EDUCATION|PROJECTS|WORK EXPERIENCE|LEADERSHIP EXPERIENCE|REFERENCES|EXTRA-CURRICULAR ACTIVITIES|AWARDS|HONORS|ACHIEVEMENTS|VOLUNTEER EXPERIENCE|COMMUNITY INVOLVEMENT|INTERESTS|HOBBIES)/
);
return match ? match[2].trim() : "No skills found.";
}



function extractExperience (text){// Match the experience section using regex
  const match = text.match(
    /(experience|work experience|professional experience)[\s:–-]*([\s\S]*?)(?=\n{2,}|skills|education|projects|summary|certifications|interests|achievements)/i
  );
  return match ? match[2].trim() : "No experience found.";}
module.exports={resumeUpload};