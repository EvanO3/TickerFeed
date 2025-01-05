const Router = require("express")
const UserRoutes = require("../Routes/Users.js")
const UploadRoutes = require("../Routes/FileUpload.js")
const jobRouter = require("../Routes/Jobs.js")
const router =Router()


router.use("/api",UserRoutes)
router.use("/api", UploadRoutes);
router.use("/api", jobRouter);
module.exports=router;