var path = require('path');
var express = require('express');
var router = express.Router();


var loggedin = (req, res, next)=>{
    if (req.isAuthenticated()) next();
    else res.redirect("/login");
};


module.exports = function (passport) {
    router.post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            successRedirect: '/admin',
    }));

    router.get('/', loggedin,(req, res) => {
        res.sendFile(path.join(__dirname + "../../../Client/HTML/monitor.html"));
    });

    router.get('/logout', (req, res)=>{
        req.logout();
        res.redirect("/login");
    });

    return router;
};