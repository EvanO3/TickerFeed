const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt
const passport = require('passport');
const User = require("../models/user");

let opts ={}

opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req=>{
        return req && req.cookies ? req.cookies.SessionID: null;
    })
]);
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async(jwt_payload, done)=>{
        try{
            const user = await User.findById(jwt_payload.userId);
            if(user){
                return done(null, user)
            }else{
                return done(null, false)
            }
        }catch(err){
            console.error(err)
        }
}))