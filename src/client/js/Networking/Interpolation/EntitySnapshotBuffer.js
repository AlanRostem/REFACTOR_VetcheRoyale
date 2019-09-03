// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import {vectorLinearInterpolation, addVec, vecSub, vecMulScalar} from "../../../../shared/code/Math/CCustomMath.js";
import {linearInterpolation} from "../../../../shared/code/Math/CCustomMath.js";

const INTERPOLATION_OFFSET = 0.2; // Milliseconds in the past
const SMOOTHING_PERCENTAGE = .36;

export default class EntitySnapshotBuffer {
    constructor(initDataPack) {
        this.output = initDataPack;
        this.buffer = []; // Keeps snapshots of the history
        this.size = 4;
    }

    get length() {
        return this.buffer.length;
    }

    get first() {
        return this.buffer[0];
    }

    get last() {
        return this.buffer[this.length - 1];
    }

    get(i) {
        return this.buffer[i];
    }

    pushBack(data) {
        this.buffer.push(data);
    }

    popFront(alloc = 1) {
        this.buffer.splice(0, alloc);
    }

    t_directServerUpdate(data, entity) {
        entity.output = data;
    }

    onServerUpdateReceived(data, entity, client) {
        //this.tdirectServerUpdate(data, entity);
        data.localTimeStamp = Date.now();
        this.pushBack(data);
        if (this.length > this.size) {
            this.popFront();
        }
    }


    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity, client) {
        //this.tdirectServerUpdate(data, entity, client);
        this.onServerUpdateReceived(data, entity, client)
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client) {
        let currentTime = Date.now() - client.latency;
        let target = null;
        let previous = null;
        for (let i = 0; i < this.length - 1; i++) {
            let point = this.get(i);
            let next = this.get(i + 1);
            if (currentTime > point.timeStamp && currentTime < next.timeStamp) {
                target = next;
                previous = point;
                break;
            }
        }

        if (!target) {
            target = previous = this.get(0);
        }

        if (target && previous) {
            let targetTime = target.serverTimeStamp;
            var difference = targetTime - currentTime;
            var maxDiff = (target.serverTimeStamp - previous.serverTimeStamp).fixed(3);
            var timePoint = (difference / maxDiff).fixed(3);

            if (isNaN(timePoint) || Math.abs(timePoint) === Infinity) {
                timePoint = 0;
            }
            for (let key in target) {
                if (key !== "pos") {
                    entity.output[key] = target[key];
                }
            }

            entity.output.pos =
                vectorLinearInterpolation(entity.output.pos,
                    vectorLinearInterpolation(previous.pos, target.pos, timePoint),
                    SMOOTHING_PERCENTAGE);
        }
    }

    remove(i) {
        this.buffer.splice(i);
    }


}