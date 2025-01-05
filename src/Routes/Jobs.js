const Router = require("express");
const router = Router();
const jobController = require("../controller/jobsController")

router.get("/jobs",jobController.retrieveJobs);

module.exports=router