var EntityManager = require("./Entity/EntityManager.js");
var WebSocket = require("../Networking/WebSocket.js");

class Game {
    constructor(socket) {
        this.entityManager = new EntityManager();
        this.mainSocket = new WebSocket(socket);
    }

    update() {
        this.entityManager.updateEntities(); // Update the entities, then send data to clients
        for (var id in this.mainSocket.clientList) {
            var client = this.mainSocket.clientList[id];
            client.update(this.entityManager);
        }
    }

    start() {
        setInterval(() => this.update(), 1000/30);
    }
}

module.exports = Game;