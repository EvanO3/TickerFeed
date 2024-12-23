const Router = require("express");
const router = Router();
const userController = require("../controller/userController.js")
const { checkSchema, validationResult } = require("express-validator");
const userValidator = require("../utils/userValidation.js")
const loginValidation = require("../utils/loginValidation.js")
const handleValidation = require("../utils/handleValidationError.js")
const auth = require("../utils/Auth.js")

router.post("/register", checkSchema(userValidator.userValidation),handleValidation.handleValidationError,userController.createUser,);
router.post("/login", checkSchema(loginValidation.loginValidation), handleValidation.handleValidationError,userController.login)
router.get("/logout", userController.logout)
router.get("/homePage", auth.authenticate, (req,res)=>{
    res.send({msg:`Welcome ${req.user.name}`})
})
module.exports=router;