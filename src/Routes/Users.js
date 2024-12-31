const Router = require("express");
const router = Router();
const userController = require("../controller/userController.js")
const { checkSchema, validationResult } = require("express-validator");
const userValidator = require("../utils/userValidation.js")
const loginValidation = require("../utils/loginValidation.js")
const handleValidation = require("../utils/handleValidationError.js")
const auth = require("../utils/Auth.js")
const {clerkClient, requireAuth} = require("@clerk/express")

router.post("/register", checkSchema(userValidator.userValidation),handleValidation.handleValidationError,userController.createUser);
router.post("/login", checkSchema(loginValidation.loginValidation), handleValidation.handleValidationError,userController.login)
router.get("/logout", userController.logout)

//Clerk expects a front-end route for signin so change when front-end is made
router.get("/homePage", requireAuth({ signInUrl:"/login"}), (req, res) => {
  res.send({ msg: `Welcome ${req.user.name}` });
});
module.exports=router;