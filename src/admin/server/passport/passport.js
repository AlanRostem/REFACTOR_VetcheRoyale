var LocalStrategy = require("passport-local").Strategy;
var Users = require("../../../shared/res/users.json");
var crypto = require('crypto');

const secret = 'abcdefg';

var hash = function (password, s = secret) {
    return crypto.createHmac('sha256', s)
        .update(password)
        .digest('hex');
};

var verify = function(user, pws2){
    if (!user) return false;
    if (user.password !== hash(pws2)) return false;
    if (user.loggedin) return false;
    user.loggedin = true;
    return true;
};

Users.find = function(username){
    for (let key in this)
        if (this[key].username === username)
            return this[key];
    return null;
};

Users.findOne = function(username, callback){
    var err = null, user = null;
    for (let key in this)
        if (this[key].username === username)
                user = this[key];
    callback(err, user);
};

module.exports = function (passport) {
    passport.users = Users;

    passport.logut = (req) => {
        passport.users.find(req.user).loggedin = false;
        req.logout();
    };

    passport.serializeUser((user, done)=>{
        done(null, user.username);
    });

    passport.deserializeUser((user, done)=>{
        done(null, user);
    });

    passport.use(new LocalStrategy((username, password, done)=>{
        Users.findOne(username, (err, user)=>{
            if (err) done(err);
            if(verify(user, password))
                done(null, user);
            else
                done(null, false);
        });
    }))
};