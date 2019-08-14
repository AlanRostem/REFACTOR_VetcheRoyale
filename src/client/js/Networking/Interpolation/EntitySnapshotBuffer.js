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

    first() {
        return this._buffer[0];
    }

    last() {
        return this._buffer[this.length - 1];
    }

    get(i) {
        return this._buffer[i];
    }

    pushBack(data) {
        this._buffer.push(data);
    }

    popFront() {
        this._buffer.splice(0, 1);
    }


    t_directServerUpdate(data, entity) {
        this._result = data;
        entity._output = this._result;
    }

    clientPrediction(entity, client, timeSyncer, deltaTime) {
        if (client.input.getKey(68)) {
            entity._output._pos._x += 1;
        }

        if (client.input.getKey(65)) {
            entity._output._pos._x -= 1;
        }
    }

    interpolation(entity, timeSyncer, client, deltaTime) {
        let currentTime = this._clientTime;
        let target = null;
        let previous = null;
        for (let i = 0; i < this.length - 1; i++) {
            let point = this.get(i);
            let next = this.get(i + 1);
            if (currentTime - INTERPOLATION_OFFSET > point.timeStamp && currentTime < next.timeStamp) {
                target = next;
                previous = point;
                break;
            }
        }

        if (!target) {
            target = previous = this.get(0);
        }

        if (target && previous) {
            let targetTime = target.timeStamp;
            var difference = targetTime - currentTime;
            var maxDiff = (target.timeStamp - previous.timeStamp).fixed(3);
            var timePoint = (difference / maxDiff).fixed(3);

            if (isNaN(timePoint) || Math.abs(timePoint) === Infinity) {
                timePoint = 0;
            }
            for (let key in target) {
                if (key !== "_pos") {
                    entity._output[key] = target[key];
                }
            }

            entity._output._pos =
                vectorLinearInterpolation(entity._output._pos,
                    vectorLinearInterpolation(previous._pos, target._pos, timePoint),
                    SMOOTHING_PERCENTAGE);

            if (entity._output._id === client.id) {

            }

        }
    }

    onServerUpdateReceived(data, entity, timeSyncer, client) {
        this._clientTime = data.timeStamp - INTERPOLATION_OFFSET;
        this.pushBack(data);
        if (this.length > this._size) {
            this.popFront();
        }

    }


    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity, timeSyncer, client) {
        //this.t_directServerUpdate(data, entity);
        this.onServerUpdateReceived(data, entity, timeSyncer, client);
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client, timeSyncer) {
        this.interpolation(entity, timeSyncer, client, deltaTime);

    }

    remove(i) {
        this._buffer.splice(i);
    }


}