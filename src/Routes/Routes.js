const Router = require("express")
const UserRoutes = require("../Routes/Users.js")
const UploadRoutes = require("../Routes/FileUpload.js")
const router =Router()

router.use("/api",UserRoutes)
router.use("/api", UploadRoutes);
module.exports=router;