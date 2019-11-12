var localStrategy = require("passport-local").Strategy;
var User = require("../../../shared/res/users.json");
var crypto = require('crypto');

const secret = 'abcdefg';

var hash = function (password, s = secret) {
    return crypto.createHmac('sha256', s)
        .update(password)
        .digest('hex');
};

var verify = function(pws1, pws2){
  return pws1 === hash(pws2);
};

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
                    if(verify(user.password, password))
                        done(null, user);
                    else done(null, false);
                }
                else done(null,false);
            }
        });
    }))
};