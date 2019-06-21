var EntityManager = require("./Entity/Management/EntityManager.js");
var WebSocket = require("../Networking/WebSocket.js");

class Game {
    constructor(socket) {
        this.entityManager = new EntityManager(true);
        this.mainSocket = new WebSocket(socket, this.entityManager);
        this._deltaTime = 0;
        this._lastTime = 0;
        this._tickRate = 60; // Hz
        /*IDEA
        Having the tick rate at 30 hz benefits the
        server when reaching a very high entity count
        because the tick rate is held consistently.
        I tested this with 500 entities and the server
        was way more stable with 30 Hz. We can also try
        50 Hz if possible.
         */
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
        setInterval(() => this.update(), 1000/this._tickRate);
        // Server tick rate of 30hz. We will create a state
        // predictor system on the client making movement
        // smooth only on the client.
    }
}

module.exports = Game;