export default class CompositePhysicsListener {
    constructor(client) {
        this._pendingProcesses = [];
        this._sequence = 0;
        this._eventStates = {};
    }

    setPhysicsEvent(key, boolean) {
        this._eventStates[key] = boolean;
    }

    onServerUpdate(client) {
        this.serverReconciliation(client);
    }

    onClientUpdate(client) {
        let events = {
            eventStates: this._eventStates,
            sequence: this._sequence++
        };

        let process = 0;
        for (let event in this._eventStates) {
            if (this._eventStates[event]) {
                process = 1;
                break;
            }
        }

        client.setOutboundPacketData("physicsReconciliation", events);

        if (!process) {
            return;
        }

        if (client.player) {
            client.player.processReconciledPhysics(client, events);
        }
        this._pendingProcesses.push(events);

    }

    serverReconciliation(client) {
        let pending = this._pendingProcesses;
        let j = 0;
        while (j < pending.length) {
            let process = pending[j];
            if (process.sequence <= client.inboundPacket.lastProcessedPhysicsSequence) {
                pending.splice(j, 1);
            } else {
                // TODO: Implement a separate reconciliation algorithm for physics certain events
                client.player.processReconciledPhysics(client, process);
                j++;
            }
        }
    }
    
}