const Router = require("express")
const router = Router();
const stockController= require("../controller/stockController")
const rateLimit = require("express-rate-limit");
 const slowDown =require("express-slow-down")
const passport = require("passport")
const limiter = rateLimit({

    windowMs:10*60*1000,
    max:3
})
const slowLimiter = slowDown({
  windowMs: 10 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 2000,
});
router.use(limiter)
router.use(slowLimiter)
router.get("/stocks", passport.authenticate('jwt', {session:false}), stockController.getStockInfo);
router.post("/stocks/addWatchList", passport.authenticate('jwt', {session:false}), stockController.addToWatchList)
router.get("/stocks/watchlist", passport.authenticate('jwt', {session:false}), stockController.getWatchList);
router.get("/stocks/earnings", passport.authenticate('jwt', {session:false}), stockController.getEarningReports);
router.delete("/stocks/remove/watchlist", passport.authenticate('jwt', {session:false}), stockController.removeFromWatchList);
router.get("/stocks/price", passport.authenticate('jwt', {session:false}), stockController.getCurrentPrice)
router.get("/stocks/history",passport.authenticate('jwt', {session:false}), stockController.getStockHistory)

module.exports=router;