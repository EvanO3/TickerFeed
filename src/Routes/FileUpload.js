const Router = require("express")
const router = Router();

const upload = require("../utils/multer.js")
const User = require("../models/user.js")
const resume = require("../controller/resumeController.js")
const passport = require("passport")
require("../utils/jwt-strategy.js")

//post reques to handle router to uploading files

router.post("/uploadResume",passport.authenticate('jwt',{session:false}),upload.single("file"),resume.resumeUpload
);

module.exports=router
