/**
 * this mutler utility will take care of the file uploading 
 * 
 */

const multer = require("multer")
const path = require("path")
//this will store trhe files in disk on comp, change to s3 bucket 
const storage = multer.diskStorage({
    destination:(req,file, cb)=>{
        cb(null,"uploads/")
    },
    filename: (req,file,cb)=>{
        console.log(file)
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    },
});

const upload = multer({
  storage:storage,
  //adding validaions for file size etc 1MB file upload
 limits: { fileSize: 10*1024*1024}
  //file type validation to be added after we find out what resume file type we will accept i.e pdf,.docs 
});

module.exports=upload