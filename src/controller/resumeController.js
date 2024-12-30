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
    const Education = extractEducation(resumeText) ;
    const experience = extractExperience(resumeText);
    const projects = extractProjects(resumeText)
    const APIKEY;
    //return { cleanedSkill, cleanedExperience };
    

console.log(projects);

}


function extractEducation(text){
    const EducationRegex = /(education|educational background|academic qualifications)[\s:]*\n([\s\S]*?)(?=\n{2,}|skills|work experience|certifications|projects|summary|achievements|$)/i;
    const match = text.match(EducationRegex)

    if(!match){
        console.log("No match found for education")
    }

    return match ? match[0] : "No match found"


}

function extractExperience(text){
  const ExperienceRegex =
    /(experience|work experience|professional experience)[\s:-]*([\s\S]*?)(?=\n{2,}|skills|certifications|projects|summary|achievements)/i;

  ///


  const match = text.match(ExperienceRegex);
  if (!match) {
    console.log("No match for experience");
  }

  return match ? match[0] : "Match for experience not found";
}



function extractProjects(text){
    const projectsRegex1 =
      /(projects|relevant projects|personal projects|leadership roles|certifications)[\s:-]*(\([^)]+\))?[\s:-]*([\s\S]*?)(?=\n{2,}(?=\n[A-Z][a-zA-Z\s]*:|$)(?!.*\n{2,}))/i;

      //(projects|relevant projects|personal projects|leadership roles|certifications)[\s:-]*([\s\S]*?)(?=\n[A-Z][a-zA-Z\s]*:|$)/i;




      const projectsRegex2 =
        /(?:PROJECTS|RELEVANT PROJECTS|PERSONAL PROJECTS|LEADERSHIP ROLES|CERTIFICATIONS|[\*]{2}(?:Projects|Relevant Projects|Personal Projects|Leadership Roles|Certifications)[\*]{2})[\s\S]*?(?=\n+(?:[A-Z][A-Z]+\s*|[\*]{2}[A-Za-z\s]+[\*]{2})\n|$)(?!\n+(?:WORK EXPERIENCE|SKILLS|SKILLS & INTERESTS|EDUCATION|SUMMARY|CERTIFICATIONS)\b)/
      //(?:PROJECTS|RELEVANT PROJECTS|PERSONAL PROJECTS|LEADERSHIP ROLES|CERTIFICATIONS|[\*]{2}(?:Projects|Relevant Projects|Personal Projects|Certifications)[\*]{2})[\s\S]*?(?=\n+(?:[A-Z][A-Z]+\s*|[\*]{2}[A-Za-z\s]+[\*]{2})\n|$)(?![\s\S]*\n+(?:WORK EXPERIENCE|SKILLS|SKILLS & INTERESTS|EDUCATION|SUMMARY)\b)/gi;

       //(?:PROJECTS|RELEVANT PROJECTS|PERSONAL PROJECTS|LEADERSHIP ROLES|CERTIFICATIONS|[\*]{2}(?:Projects|Relevant Projects|Personal Projects|Leadership Roles|Certifications)[\*]{2})[\s\S]*?(?=\n+(?:[A-Z][A-Z]+\s*|[\*]{2}[A-Za-z\s]+[\*]{2})\n|$)(?!\n+(?:WORK EXPERIENCE|SKILLS|SKILLS & INTERESTS|EDUCATION|SUMMARY|CERTIFICATIONS)\b)




    let match = text.match(projectsRegex1)

    //checks if there is not a match, if so log no projects found.
    if(!match || match.length ===0){
       
        match = text.match(projectsRegex2);
    }
    //if match then return first match found, if not function will return no project found
    return match ? match[0]:"no project found"

}
module.exports={resumeUpload};