import RemotePlayer from "./RemotePlayer.js";

// The player the client controls. It contains the client prediction code.

let set = 0;
export default class UserPlayer extends RemotePlayer {
    constructor(data) {
        super(data);
    }

    updateFromDataPack(dataPack, client) {
        //super.updateFromDataPack(dataPack, client);
        this._output = dataPack;
        this.serverReconciliation(client);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
    }

    serverReconciliation(client) {
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


}