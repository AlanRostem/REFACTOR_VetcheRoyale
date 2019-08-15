import RemotePlayer from "./RemotePlayer.js";

// The player the client controls. It contains the client prediction code.

export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
    }

    update(deltaTime, client, timeSyncer) {
        super.update(deltaTime, client, timeSyncer);
    }

    updateFromDataPack(dataPack, client, timeSyncer) {
        super.updateFromDataPack(dataPack, client, timeSyncer);
    }

}