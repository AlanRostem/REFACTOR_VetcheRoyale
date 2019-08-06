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
        this._result = initDataPack;
        this._buffer = []; // Keeps snapshots of the history
    }

    get length() {
        return this._buffer.length;
    }

    get(i) {
        return this._buffer[i];
    }


    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity, timeSyncer) {
        this._result = data;
        entity._output = this._result;
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client, timeSyncer) {
    }

    remove(i) {
        this._buffer.splice(i);
    }


}