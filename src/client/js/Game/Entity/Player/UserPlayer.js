import RemotePlayer from "./RemotePlayer.js";

// The player the client controls. It contains the client prediction code.

export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        this.serverReconciliation(deltaTime, client);
    }

    serverReconciliation(deltaTime, client) {
        let pending = client.input.pending;
        let j = 0;
        while (j < pending.length) {
            let input = pending[j];
            if (input.sequence <= client.inboundPacket.lastProcessedInputSequence) {
                pending.splice(j, 1);
            } else {
                // TODO
                this._output._pos._x += Math.sign(input.pressTime);
                j++;
            }
        }
    }

    updateFromDataPack(dataPack, client) {
        super.updateFromDataPack(dataPack, client);
    }

}