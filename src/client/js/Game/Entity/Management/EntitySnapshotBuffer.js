// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import Constants from "../../../../../shared/Constants.js";
import MyClient from "../../../Networking/MyClient.js";
import Scene from "../../Scene.js";
import Vector2D from "../../../../../shared/Math/CVector2D.js";

export default class EntitySnapshotBuffer {
    constructor(size) {
        this._size = size;
        this._container = []; // Keeps snapshots of the history
        this._oldestTick = 0;
        this.historyDuration = 0;
        this.velocityTolerance = 64; // TODO: Get a better value
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
        var dt = Math.max(0, this.historyDuration - MyClient.getPing()/1000);
        this.historyDuration -= dt;
        while (this.length > 0 && dt > 0) {
            if (dt >= this.get(0).deltaTime) {
                dt -= this.get(0).deltaTime;
                this.remove(0);
            } else {
                var t = 1 - dt / this.get(0).deltaTime;
                this.get(0).deltaTime -= dt;
                this.get(0)._pos._x *= t;
                this.get(0)._pos._y *= t;
                break;
            }
        }

        entity.serverState = data;

        //if (Vector2D.distance(entity.serverState._pos, this.get(0)._pos) > this.velocityTolerance) {
          //  entity.targetState = entity.serverState;
        //}

    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client) {
        if (entity.isClient) {
            if (this.length >= (1/deltaTime|0) * this._size) {

            }
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