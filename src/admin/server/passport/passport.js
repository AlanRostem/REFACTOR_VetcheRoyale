var localStrategy = require("passport-local").Strategy;
var User = require("../../../shared/res/users.json");

User.findOne = function(username, callback){
    callback(null, this[username]);
};


module.exports = function (passport) {
    passport.serializeUser((user, done)=>{
        done(null, user);
    });
    passport.deserializeUser((user, done)=>{
        done(null, user);
    });
    passport.use(new localStrategy((username, password, done)=>{
        User.findOne(username, (err, user)=>{
            if (err) done(err);
            else {
                if (user){
                   if(user.password === password) done(null, user);
                   else done(null,false);
                }
                else
                    done(null,false);
            }
        });
    }))
};