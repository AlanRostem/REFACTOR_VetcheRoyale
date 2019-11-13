var LocalStrategy = require("passport-local").Strategy;
var Users = require("../../../shared/res/users.json");
var crypto = require('crypto');

const secret = 'abcdefg';

var hash = function (password, s = secret) {
    return crypto.createHmac('sha256', s)
        .update(password)
        .digest('hex');
};

console.log(hash("test"));

var verify = function(user, pws2){
  return user.password === hash(pws2) && !user.loggedin;
};

Users.find = function(username, callback){
    for (let key in this)
        if (this[key].username === username)
            return this[key];
    return null;
};

Users.findOne = function(username, callback){
    let user = null;
    for (let key in this)
        if (this[key].username === username)
            user = this[key];
    callback(null, user);
};

module.exports = function (passport) {
    passport.users = Users;

    passport.serializeUser((user, done)=>{
        done(null, user.username);
    });
    passport.deserializeUser((user, done)=>{
        done(null, user);
    });
    passport.use(new LocalStrategy((username, password, done)=>{
        Users.findOne(username, (err, user)=>{
            if (err) done(err);
            else {
                if (user){
                    if(verify(user, password)){
                        user.loggedin = true;
                        done(null, user);
                    }
                    else done(null, false);
                }
                else done(null, false);
            }
        });
    }))
};