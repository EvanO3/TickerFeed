const Router = require("express");
const router = Router();
const userController = require("../controller/userController.js")
const { checkSchema, validationResult } = require("express-validator");
const userValidator = require("../utils/userValidation.js")
const loginValidation = require("../utils/loginValidation.js")
const handleValidation = require("../utils/handleValidationError.js")
const auth = require("../utils/Auth.js")

const passport = require("passport")
 require("../utils/local-strategy.js");
 require("../utils/jwt-strategy.js")


router.post("/register", checkSchema(userValidator.userValidation),handleValidation.handleValidationError,userController.createUser);
router.post(
  "/login",
  checkSchema(loginValidation.loginValidation),
  handleValidation.handleValidationError,
  passport.authenticate('local', { session: false }),
  userController.login
);
router.get("/logout", userController.logout)

//Clerk expects a front-end route for signin so change when front-end is made
router.get("/homePage", passport.authenticate('jwt',{session:false}), (req, res) => {
  res.send({ msg: `Welcome ${req.user.firstname}` });
});

router.get("/auth/check",passport.authenticate('jwt',{session:false}), (req,res)=>{
  if(req.user){
    res.status(200).json({authenticated:true, user:req.user})
  }else{
    res.status(401).json({authenticated:false})
  }
})
module.exports=router;