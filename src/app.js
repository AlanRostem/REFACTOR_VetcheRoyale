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
   secret:'thesecret',
   saveUninitialized:false,
   resave:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname)));
app.use(user);
app.use("/admin", auth);

// All these app.get calls send the following
// directories to the client.


PORT = process.env.PORT || 8080;
server.listen(PORT);

console.log("Dome 24 online!");
console.log("DEBUG MODE: Hosting on http://localhost:" + PORT + "/");
console.log("DEBUG MODE: Hosting on http://localhost:" + PORT + "/login");

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