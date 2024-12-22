const Router = require("express");
const router = Router();
const userController = require("../controller/userController.js")
const { checkSchema, validationResult } = require("express-validator");
const userValidator = require("../utils/userValidation.js")
const handleValidation = require("../utils/handleValidationError.js")
router.post("/api/register", checkSchema(userValidator.userValidation),handleValidation.handleValidationError,userController.createUser,);

module.exports=router;