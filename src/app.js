// Main entry point of the app-side application

var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(path.join(__dirname + '/client')));

app.get('/client/js/VetcheRoyale.js', (req, res) => {
   res.sendFile(path.join(__dirname + "/VetcheRoyale.js"));
});

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname + "/client/html/index.html"));
});

server.listen(3000);