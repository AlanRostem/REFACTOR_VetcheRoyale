// Main entry point of the app-side application

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(path.join(__dirname)));

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
io.on("connection", client => {
   console.log("Establishing connection... Client ID: <" + client.id + ">");
   client.emit("connectClient", {id: client.id});
   client.on("connectClientCallback", data => {
      console.log("Client <" + data.id + "> successfully connected!");
   });
});

