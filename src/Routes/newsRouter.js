const Router = require("express");
const router = Router();
const newsController = require("../controller/newsController")

router.get("/news/",newsController.getStockNew)


module.exports=router;