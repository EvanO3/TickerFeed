

const userValidation = {
  name: {
    notEmpty: true,
    trim: true,
    errorMessage: "Name must not be empty",
  },

  email: {
    notEmpty: true,
    trim: true,
    isEmail: {
      errorMessage: "Input must be an Email Address",
    },
  },

  password: {
    errorMessage: "Password must be 8 chars long and contain a special char",
    notEmpty: true,
    trim: true,

    //checks to see if its a strong password

    isStrongPassword: {
      options: {
        min: 8,
        minUpperCase: 1,
        minLowerCase: 1,
        minSymbols: 1,
      },
    },
    //this will ensure the password must have a special char
    matches: { options: /^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/ },
  },

  //add date validation
  Date: {},
};


module.exports = {
  userValidation,
};