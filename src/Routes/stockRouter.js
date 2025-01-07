const Router = require("express")
const router = Router();
const stockController= require("../controller/stockController")
//passport.authenticate('jwt',{session:false})
router.get("/stocks/", stockController.getStockInfo);

module.exports=router;