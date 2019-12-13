// Main entry point of the server-side application

var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var session = require('express-session');
var passport = require('passport');
require('./admin/server/passport/passport.js')(passport);

var auth = require('./admin/server/passport/routeAuth.js')(passport);
var user = require('./router.js')();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'thesecret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 3600000,
        //secure: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname)));
app.use(user);
app.use("/admin", auth);
app.use('/bootstrap/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/jquery/js', express.static(__dirname + '/../node_modules/jquery/dist')); // redirect JS jQuery
app.use('/bootstrap/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

PORT = process.env.PORT || 8080;
server.listen(PORT);

console.log("Dome 24 online!");
console.log("DEBUG MODE: Hosting on http://localhost:" + PORT + "/");
console.log("DEBUG MODE: Hosting on http://localhost:" + PORT + "/admin");

var io = require('socket.io').listen(server);
var GameServer = require("./server/Networking/GameServer.js");
var gameServer = new GameServer(io);
gameServer.start();

process.stdin.on("data", (data) => {
    try {
        let object = eval(data.toString());
        console.log(object);
    } catch (e) {
        console.log(e.name + ":", e.message);
    }
});