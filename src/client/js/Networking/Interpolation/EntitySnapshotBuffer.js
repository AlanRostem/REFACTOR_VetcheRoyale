// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import {vectorLinearInterpolation, addVec, vecSub, vecMulScalar} from "../../../../shared/code/Math/CCustomMath.js";
import {linearInterpolation} from "../../../../shared/code/Math/CCustomMath.js";

const INTERPOLATION_OFFSET = 0.2; // Milliseconds in the past
const SMOOTHING_PERCENTAGE = .36;

export default class EntitySnapshotBuffer {
    constructor(initDataPack) {
        this._result = initDataPack;
        this._buffer = []; // Keeps snapshots of the history
        this._serverTime = initDataPack.timeStamp;
        this._clientTime = initDataPack.timeStamp;
        this._size = 6;
    }

    get length() {
        return this._buffer.length;
    }

    get first() {
        return this._buffer[0];
    }

    get last() {
        return this._buffer[this.length - 1];
    }

    get(i) {
        return this._buffer[i];
    }

    pushBack(data) {
        this._buffer.push(data);
    }

    popFront(alloc = 1) {
        this._buffer.splice(0, alloc);
    }


    t_directServerUpdate(data, entity) {
        this._result = data;
        entity._output = this._result;
    }



    onServerUpdateReceived(data, entity, client) {
        this.t_directServerUpdate(data, entity);
    }


    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity, client) {
        this.onServerUpdateReceived(data, entity, client)
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client) {

    }

    remove(i) {
        this._buffer.splice(i);
    }


}