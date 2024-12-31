

const userValidation = {
  firstname: {
    notEmpty: true,
    trim: true,
    escape: true,
    errorMessage: "First Name must not be empty",
  },
  lastname: {
    notEmpty: true,
    trim: true,
    escape: true,
    errorMessage: "Last name must not be empty",
  },

  email: {
    notEmpty: true,
    trim: true,
    isEmail: {
      errorMessage: "Input must be an Email Address",
    },
    normalizeEmail: true,
    escape: true,
  },

//   password: {
//     errorMessage: "Password must have min 8 chars  and contain a special char",
//     notEmpty: true,
//     trim: true,
//     escape: true,

//     //checks to see if its a strong password

//     isStrongPassword: {
//       options: {
//         min: 8,
//         minUpperCase: 1,
//         minLowerCase: 1,
//         minSymbols: 1,
//       },
//     },
//     //this will ensure the password must have a special char
//     matches: { options: /^(?=.*[!@#$%^&*(),.?":{}|<>]).*$/ },
//   },

  //add date validation
  Date: {},
};


module.exports = {
  userValidation,
};