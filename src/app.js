// Main entry point of the server-side application

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var user = require('./router.js')();




app.use(express.static(path.join(__dirname)));
app.use(user);


PORT = process.env.PORT || 8080;
server.listen(PORT);

console.log("Dome 24 online!");
console.log("DEBUG MODE: Hosting on http://localhost:" + PORT + "/");

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