const Router = require("express")
const UserRoutes = require("../Routes/Users.js")
const StockRoutes = require("../Routes/stockRouter.js")
const NewsRouter = require("../Routes/newsRouter.js")
const router =Router()


router.use("/api",UserRoutes)
router.use("/api", StockRoutes)
router.use("/api", NewsRouter);
module.exports=router;