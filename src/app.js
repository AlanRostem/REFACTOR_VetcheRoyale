// Main entry point of the server-side application

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(path.join(__dirname)));

// All these app.get calls send the following
// directories to the client.

app.get('/client/js/', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

app.get('/shared', (req, res) => {
   res.sendFile(path.join(__dirname + "/"));
});

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname + "/client/html/index.html"));
});

server.listen(3000);

console.log("Vetche Royale online!");

var io = require('socket.io').listen(server);
var Game = require("./server/Game/Game.js");
var game = new Game(io);
game.start();