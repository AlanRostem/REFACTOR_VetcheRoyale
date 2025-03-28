var path = require('path');
var express = require('express');
var router = express.Router();

module.exports = function () {

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


    return router;
};