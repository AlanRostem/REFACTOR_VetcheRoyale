var EntityManager = require("./Entity/EntityManager.js");
var WebSocket = require("../Networking/WebSocket.js");

class Game {
    constructor(socket) {
        this.entityManager = new EntityManager();
        this.mainSocket = new WebSocket(socket, this.entityManager);
    }

    update() {
        // Update the entities, then create data packs
        this.entityManager.updateEntities();
        for (var id in this.mainSocket.clientList) {
            var client = this.mainSocket.clientList[id];
            // After the entities have been updated and
            // the data packs have been supplied, they
            // are queried to the client socket and then
            // emitted to the client.
            client.update(this.entityManager);
        }
    }

    start() {
        setInterval(() => this.update(), 1000/30);
        // Server tick rate of 30hz. We will create a state
        // predictor system on the client making movement
        // smooth only on the client.
    }
}

module.exports = Game;