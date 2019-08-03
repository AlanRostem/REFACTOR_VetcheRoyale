// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import Constants from "../../../../shared/code/Tools/Constants.js";
import MyClient from "../MyClient.js";
import Scene from "../../Game/Scene.js";
import Vector2D from "../../../../shared/code/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/code/Math/CCustomMath.js";
import ServerTimeSyncer from "./ServerTimeSyncer.js";

const INTERPOLATION_TIME = 0.2; // Milliseconds in the past

export default class EntitySnapshotBuffer {
    constructor(initDataPack) {
        this._tempPoint = initDataPack;
        this._size = Math.ceil(INTERPOLATION_TIME / ServerTimeSyncer.STEP_MS) + 1;
        this._buffer = new Array(this._size); // Keeps snapshots of the history
        this._nextIndex = 0;
        this._startIndex = 0;
    }

    get length() {
        return this._buffer.length;
    }

    get(i) {
        return this._buffer[i];
    }

    pushBack(data, time) {
        this._buffer[this._nextIndex] = data;
        this._buffer[this._nextIndex].time = time;
        this._nextIndex = this.increment(this._nextIndex);
        if (this._nextIndex === this._startIndex) {
            this._startIndex = this.increment(this._startIndex);
        }
    }

    increment(i) {
        return (i + 1) % this._size;
    }

    popFront() {
        this._buffer.splice(0, this._size - 1);
    }

    interpolateAtTime(time, entity, clientDeltaTime) {
        time -= INTERPOLATION_TIME;
        this.clearOlderThan(time);
        let secondIndex = this.increment(this._startIndex);
        let first = this._buffer[this._startIndex];
        this._tempPoint = first; // TODO
        if (first.time >= time || secondIndex === this._nextIndex) {
            //not enough data for interpolation yet, wait
            this._tempPoint._pos._x = first._pos._x;
            this._tempPoint._pos._y = first._pos._y;
        } else {
            var second = this._buffer[secondIndex];
            var alpha = (time - first.time) / (second.time - first.time);
            this._tempPoint._pos._x = first._pos._x + (second._pos._x - first._pos._x) * alpha;
            this._tempPoint._pos._y = first._pos._y + (second._pos._y - first._pos._y) * alpha;
        }
        return this._tempPoint;
    }

    clearOlderThan(time) {
        if (this._startIndex === this._nextIndex) {
            return; //empty
        }
        var secondIndex = this.increment(this._startIndex);

        if (this._buffer[secondIndex])

            while (this._buffer[secondIndex].time < time && secondIndex !== this._nextIndex) {
                //second is smaller => first is useless
                //we can move the reader ahead unless we reached end
                this._startIndex = secondIndex;
                secondIndex = this.increment(secondIndex);
            }
    }

    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity, timeSyncer) {
        this.pushBack(data, timeSyncer.getNow());
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client, timeSyncer) {
        entity._output = this.interpolateAtTime(timeSyncer.timeSinceStart(), entity, deltaTime);
    }

    remove(i) {
        this._buffer.splice(i);
    }


}