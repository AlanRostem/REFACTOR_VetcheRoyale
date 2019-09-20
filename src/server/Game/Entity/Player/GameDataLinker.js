const Alive = require("../Traits/Alive.js");
const ClientPEM = require("./ClientPEM.js");
const InputBridge = require("./InputBridge.js");

// Abstract class composition of miscellaneous
// server based data given to the player by
// certain events.
class GameDataLinker extends Alive {
    constructor(x, y, w, h, HP, regenCoolDown) {
        super(x, y, w, h, HP, regenCoolDown);
        this.gameData = {};
        this.addStaticSnapShotData([
            "gameData"
        ]);
        this.entitiesInProximity = new ClientPEM(this);
        this.input = new InputBridge();
        //this.defineSocketEvents(client);
    }


    defineSocketEvents(client) {

    }

    retrieveGameData(game) {
        // TODO: send out data to client elsewise
        //this.client.setOutboundPacketData("gameData", game.dataPacket);
    }

    // Sends the initial data pack to the client.
    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this.entitiesInProximity.initProximityEntityData(entityManager);
        // TODO: send out data to client elsewise
        //this.clientRef.emit("initEntity", this.entitiesInProximity.exportDataPack())
    }

    update(entityManager, deltaTime) {
        this.retrieveGameData(entityManager);
        super.update(entityManager, deltaTime);
    }
}

module.exports = GameDataLinker;