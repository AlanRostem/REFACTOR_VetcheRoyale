const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap");

const Alive = require("../Traits/Alive.js");
const ClientPEM = require("./ClientPEM.js");
const InputBridge = require("./InputBridge.js");

// Abstract class composition of miscellaneous
// server based data given to the player by
// certain events.
class GameDataLinker extends Alive {
    constructor(x, y, w, h, HP, regenCoolDown, worldMgr) {
        super(x, y, w, h, HP, regenCoolDown);
        this.gameData = {};
        this.addStaticSnapShotData([
            "gameData"
        ]);
        this.entitiesInProximity = new ClientPEM(this);
        this.worldMgrRef = worldMgr;
        this.input = new InputBridge();
        this.outboundData = new ONMap();
    }

    emit(event, data) {
        this.worldMgrRef.dataBridge.transferClientEvent(event, this.id, data);
    }

    setOutboundPacketData(name, packet) {
        this.outboundData.set(name, packet);
    }

    retrieveGameData(game) {
        this.setOutboundPacketData("gameData", game.dataPacket);
    }

    // Sends the initial data pack to the client.
    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this.entitiesInProximity.initProximityEntityData(entityManager);
        this.emit("initEntity", this.entitiesInProximity.exportDataPack())
    }

    update(entityManager, deltaTime) {
        this.retrieveGameData(entityManager);
        super.update(entityManager, deltaTime);
    }
}

module.exports = GameDataLinker;