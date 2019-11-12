var path = require('path');
var express = require('express');
var router = express.Router();

module.exports = function () {

    router.get('/bootstrap/dist/js', (req, res) => res.sendFile(path.join(__dirname + '../node_modules/bootstrap/dist/js'))); // redirect bootstrap JS
    router.get('/jquery/dist/js', (req, res) => res.sendFile(path.join(__dirname + '../node_modules/jquery/dist'))); // redirect JS jQuery
    router.get('/bootstrap/dist/css', (req, res) => res.sendFile(path.join(__dirname + '../node_modules/bootstrap/dist/css'))); // redirect CSS bootstrap

    console.log(__dirname)

    router.get('/client/public', (req, res) => {
        res.sendFile(path.join(__dirname + "/"));
    });

    router.get('/res/tileMap', (req, res) => {
        res.sendFile(path.join(__dirname + "/"));
    });

    router.get('/client/js/', (req, res) => {
        res.sendFile(path.join(__dirname + "/"));
    });

    router.get('/shared', (req, res) => {
        res.sendFile(path.join(__dirname + "/"));
    });

    router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + "/client/html/index.html"));
    });

    router.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname + "/admin/client/HTML/login.html"));
    });

    return router;
};