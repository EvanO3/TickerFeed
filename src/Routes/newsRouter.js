const Router = require("express");
const router = Router();
const newsController = require("../controller/newsController")
const passport = require("passport")
router.get("/news", passport.authenticate('jwt', {session:false}),newsController.getStockNew)


module.exports=router;