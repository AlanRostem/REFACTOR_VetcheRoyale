const ONMap = require("../../../../shared/code/DataStructures/SObjectNotationMap");

const Alive = require("../Traits/Alive.js");
const ClientPEM = require("./ClientPEM.js");
const InputBridge = require("./InputBridge.js");

// Abstract class composition of miscellaneous
// server based data given to the player by
// certain events.
class GameDataLinker extends Alive {
    constructor(x, y, w, h, HP, regenCoolDown, worldMgr, clientID) {
        super(x, y, w, h, HP, true, 1, .2, regenCoolDown, clientID);
        this._gameData = {};

        this.entitiesInProximity = new ClientPEM(this);
        this.worldMgrRef = worldMgr;
        this.input = new InputBridge();
        this.outboundData = new ONMap();
    }

    receiveInputData(data) {
        this.input.inputData = data;
    }

    emit(event, data) {
        this.worldMgrRef.dataBridge.transferClientEvent(event, this.id, data);
    }

    setOutboundPacketData(name, packet) {
        this.outboundData.set(name, packet);
    }

    retrieveGameData(game) {
        this.setOutboundPacketData("gameData", this.gameData);
        //
    }

    // Sends the initial data pack to the client.
    initFromEntityManager(entityManager) {
        super.initFromEntityManager(entityManager);
        this.entitiesInProximity.initProximityEntityData(entityManager);
        this.emit("initEntity", this.entitiesInProximity.exportInitDataPack())
    }

    set gameData(value) {
        this._gameData = value;
    }

    get gameData() {
        return this._gameData;
    }

    updateGameData(entityManager) {
        this.gameData.mapName = entityManager.tileMap.name;
        this.gameData.playerCount = entityManager.playerCount;
        this.gameData.debugData = entityManager.debugData;
        for (let key in entityManager.dataPacket)
            this.gameData[key] = entityManager.dataPacket[key];
    }

    update(entityManager, deltaTime) {
        this.retrieveGameData(entityManager);
        super.update(entityManager, deltaTime);
        this.updateGameData(entityManager);
    }
}

module.exports = GameDataLinker;