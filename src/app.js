// Main entry point of the server-side application

var path = require('path');
var express = require('express');
var main = express();
var server = require('http').Server(main);

main.use(express.static(path.join(__dirname)));



// All these app.get calls send the following
// directories to the client.

main.get('/client/public', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

main.get('/res/tileMap', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
   console.log((__dirname + "/"))
});

main.get('/client/js/', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

main.get('/shared', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

main.get('/', (req, res) => {
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