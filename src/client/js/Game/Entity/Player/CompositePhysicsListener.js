export default class CompositePhysicsListener {
    constructor(client) {
        this._pendingProcesses = {};
        this._buffer = [];
        this._sequence = 0;
        this._eventStates = {};
    }

    onClientUpdate(client) {
        let events = {
            eventStates: this._eventStates,
            sequence: this._sequence++
        };

        client.setOutboundPacketData("physicsReconciliation", events);
    }
    
}