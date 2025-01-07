const Router = require("express")
const UserRoutes = require("../Routes/Users.js")
const StockRoutes = require("../Routes/stockRouter.js")
const router =Router()


router.use("/api",UserRoutes)
router.use("/api", StockRoutes)
module.exports=router;