// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import Constants from "../../../../shared/code/Tools/Constants.js";
import MyClient from "../MyClient.js";
import Scene from "../../Game/Scene.js";
import Vector2D from "../../../../shared/code/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/code/Math/CCustomMath.js";
import ServerTimeSyncer from "./ServerTimeSyncer.js";

const TIME_OFFSET = 0.2; // Milliseconds in the past

export default class EntitySnapshotBuffer {
    constructor(size, initDataPack) {
        this._size = size;
        this._updates = []; // Keeps snapshots of the history
        this._currentTime = initDataPack.timeStamp;
        this._timeSyncer = new ServerTimeSyncer();
        this._serverState = initDataPack;
    }

    get length() {
        return this._updates.length;
    }

    get(i) {
        return this._updates[i];
    }

    forEach(callback) {
        for (var data of this._updates) {
            callback(data);
        }
    }

    interpolateEntity(currentTime, entity, deltaTime) {
        let time = currentTime - TIME_OFFSET;
        let i = 0;
        while(this._updates[i].timeStamp < time) i++;
        let before = this._updates[i - 1];
        let after = this._updates[i];
        let alpha = (time - before.timeStamp) / (after.timeStamp - before.timeStamp);

        entity._output = after;
        entity.output._pos._x = before._pos._x + (after._pos._x - before._pos._x) * alpha;
        entity.output._pos._y = before._pos._y + (after._pos._y - before._pos._y) * alpha;
    }

    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity) {
        this._serverState = data;
        this.pushBack(data);
        if (this.length >= (1 / Scene.deltaTime | 0) * this._size) {
            this.popFront();
        }

    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client, timeSyncer) {
        this._currentTime += deltaTime;
        if (this.length > 2) {
            this.interpolateEntity(timeSyncer.getNow(), entity, deltaTime);
        }
    }

    remove(i) {
        this._updates.splice(i);
    }

    pushBack(data) {
        this._updates.push(data);
    }

    popFront() {
        this._updates.splice(0, this._size - 1);
    }

}