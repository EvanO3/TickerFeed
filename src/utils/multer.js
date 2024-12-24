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
 limits: { fileSize: 10*1024*1024},
  //file type validation to be added after we find out what resume file type we will accept i.e pdf,.docs 
  fileFilter: function(req, file, cb){
    checkFileType(file,cb)
  }
});


//fileType validation to ensure we only get PDF's
function checkFileType(file, cb){
    const fileTypes = /pdf/;
    //matching the extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true)
    }
    else{
        cb('Errpr: PDF files only')
    }
    
}
module.exports=upload