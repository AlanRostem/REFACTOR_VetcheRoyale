// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import Constants from "../../../../../shared/Constants.js";
import MyClient from "../../../Networking/MyClient.js";
import Scene from "../../Scene.js";
import Vector2D from "../../../../../shared/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../../shared/Math/CCustomMath.js";

Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

export default class EntitySnapshotBuffer {
    constructor(size, initDataPack) {
        this._size = size;
        this._container = []; // Keeps snapshots of the history
        this._oldestTick = 0;
        this._currentTime = initDataPack.timeStamp;
        this._serverState = initDataPack;
    }

    get length() {
        return this._container.length;
    }

    get(i) {
        return this._container[i];
    }

    forEach(callback) {
        for (var data of this._container) {
            callback(data);
        }
    }

    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity) {
        this.pushBack(data);
        if (this.length >= (1/Scene.deltaTime|0) * this._size) {
            this.popFront();
        }

        this._oldestTick = this.get(0).timeStamp;

        var serverTime = data.timeStamp;
        this._currentTime = serverTime - Constants.CLIENT_PREDICTION_OFFSET;
        this._serverState = data;
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client) {
        if (this.length === 0) {
            return;
        }

        var count = this.length - 1;

        var target = null;
        var previous = null;

        for (var i = 0; i < count; i++) {
            var current = this.get(i);
            var next = this.get(i+1);

            if (this._currentTime > current.timeStamp && this._currentTime < next.timeStamp) {
                target = next;
                previous = current;
                break;
            }

        }
        if (!target) {
            target = this.get(0);
            previous = this.get(0);
        }

        if (target && previous) {
            var targetTime = target.timeStamp;

            var difference = targetTime - this._currentTime;
            var maxDiff = (target.timeStamp - previous.timeStamp).fixed(3);
            var timePoint = (difference/maxDiff).fixed(3);

            if( isNaN(timePoint) ) timePoint = 0;
            if(timePoint === -Infinity) timePoint = 0;
            if(timePoint === Infinity) timePoint = 0;

            var latestState = this.get(this.length - 1);
            var ghostPos = vectorLinearInterpolation(previous._pos, target._pos, timePoint);

            var testSmoothing = 25; // TODO: Find a better value than the test
            entity._targetState._pos = vectorLinearInterpolation(entity._targetState._pos, ghostPos, deltaTime * testSmoothing);
        }
    }

    remove(i) {
        this._container.splice(i);
    }

    pushBack(data) {
        this._container.push(data);
    }

    popFront() {
        this._container.splice(0, this._size - 1);
    }

}