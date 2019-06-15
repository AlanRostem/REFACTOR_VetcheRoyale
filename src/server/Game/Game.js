var EntityManager = require("./Entity/EntityManager.js");
var WebSocket = require("../Networking/WebSocket.js");

class Game {
    constructor(socket) {
        this.entityManager = new EntityManager(true);
        this.mainSocket = new WebSocket(socket, this.entityManager);
        this._deltaTime = 0;
        this._lastTime = 0;
    }

    update() {
        if (Date.now() > 0)
            this._deltaTime = (Date.now() - this._lastTime) / 1000;

        // Update the entities, then create data packs
        this.entityManager.update(this._deltaTime);
        for (var id in this.mainSocket.clientList) {
            var client = this.mainSocket.clientList[id];
            // After the entities have been updated and
            // the data packs have been supplied, they
            // are queried to the client socket and then
            // emitted to the client.
            client.update(this.entityManager);
        }

        if (Date.now() > 0)
            this._lastTime = Date.now();
    }

    start() {
        setInterval(() => this.update(), 1000/60);
        // Server tick rate of 30hz. We will create a state
        // predictor system on the client making movement
        // smooth only on the client.
    }
}

module.exports = Game;