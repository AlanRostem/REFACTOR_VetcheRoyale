const ONMap = require("../../shared/code/DataStructures/SObjectNotationMap.js");

// Manages all the game worlds and match queueing.
// TODO: Add match queueing.
class Matchmaker {
    constructor() {
        this.queuedPlayers = new ONMap;
        this.lastCreatedWorldID = -1;
    }

    queueClientToGame(client) {
        this.queuedPlayers.set(client.id, client);
    }

    update(server) {
        for (let client of this.queuedPlayers.array) {

        }
    }
}

module.exports = Matchmaker;