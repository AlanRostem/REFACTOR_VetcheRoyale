// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import Constants from "../../../../../shared/Constants.js";
class EntitySnapshotBuffer {
    constructor(size) {
        this._size = size;
        this._container = [];
        this._oldestTick = 0;
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
    update(data, deltaTime) {
        this.pushBack(data);
        if (this._container.length >= Constants.MAX_CLIENT_FPS * this._size) {
            this.popFront();
        }
    }

    pushBack(data) {
        this._container.push(data);
    }

    popFront() {
        this._container.splice(0, this._size - 1);
    }

}