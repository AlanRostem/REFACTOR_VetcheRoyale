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
        this.clientProcessPredictionCorrection(client);
    }

    clientProcessPredictionCorrection(client) {
        if (!this._dataBuffer.length) return;

        let dataBuffer = this._dataBuffer;
        let latest = dataBuffer.last;
        let serverPos = latest._pos;

        let lastInput = client.input.buffer.lastInputSeq;
        if (lastInput) {
            let lastInputIdx = -1;
            for (let i = 0; i < client.inputBufferArray.length; i++) {

            }
        }
    }
}