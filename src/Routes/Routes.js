const Router = require("express")
const UserRoutes = require("../Routes/Users.js")

const router =Router()

router.use("/api",UserRoutes)

module.exports=router;