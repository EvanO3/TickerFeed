const loginValidation = {
  email: {
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
    isEmail:{
        errorMessage:"Must input an email"
    }
  },

  password: {
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
   isLength:{
    options:{
        min:8
    }
   }
  },
};

module.exports = {
  loginValidation
};