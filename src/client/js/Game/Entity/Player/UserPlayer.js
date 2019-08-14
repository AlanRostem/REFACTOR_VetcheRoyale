import RemotePlayer from "./RemotePlayer.js";

// The player the client controls. It contains the client prediction code.

export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
    }

    update(deltaTime, client, timeSyncer) {
        super.update(deltaTime, client, timeSyncer);
        let vec = client.input.buffer.processInput(client);
        this._output._pos._x += vec._x;
        //this._output._pos._y += vec._y; //TODO
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

        let lastInput = client.input.buffer.lastServerInputSeq;
        if (lastInput) {
            let lastInputIdx = -1;
            for (let i = 0; i < client.inputBufferArray.length; i++) {
                if (client.inputBufferArray[i].seq === lastInput) {
                    lastInputIdx = i; break;
                }
            }

            if (lastInputIdx !== -1) {
                let clearCount = lastInputIdx + 1;
                client.inputBufferArray.splice(0, clearCount);
                if (this._dataBuffer.last) {
                    //this._output._pos = this._dataBuffer.last._pos;
                }
                client.input.buffer.lastInputSeq = lastInputIdx;
            }
        }
    }
}