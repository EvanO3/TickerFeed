const {validationResult} = require("express-validator")

const handleValidationError = (req,res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
           errors: errors.array()
        });
    }
    next();
}

module.exports={handleValidationError}