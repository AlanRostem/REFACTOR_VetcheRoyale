// Main entry point of the server-side application

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(path.join(__dirname)));


 
// All these app.get calls send the following
// directories to the client.

app.get('/client/public', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

app.get('/res/tileMap', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
   console.log((__dirname + "/"))
});

app.get('/client/js/', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

app.get('/shared', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname + "/client/html/index.html"));
});

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