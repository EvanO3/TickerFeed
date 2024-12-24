const Router = require("express")
const router = Router();

const upload = require("../utils/multer.js")
const User = require("../models/user.js")
const auth = require("../utils/Auth.js")
const resume = require("../controller/resumeController.js")
//post reques to handle router to uploading files

router.post("/uploadResume",auth.authenticate, upload.single("file"), resume.resumeUpload);

module.exports=router
