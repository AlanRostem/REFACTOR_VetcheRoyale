// Buffers data inbound packs of entities
// from the server. Composed in an entity.

import Constants from "../../../../shared/code/Tools/Constants.js";
import MyClient from "../MyClient.js";
import Scene from "../../Game/Scene.js";
import Vector2D from "../../../../shared/code/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/code/Math/CCustomMath.js";
import ServerTimeSyncer from "./ServerTimeSyncer.js";

const INTERPOLATION_OFFSET = 0.2; // Milliseconds in the past

export default class EntitySnapshotBuffer {
    constructor(initDataPack) {
        this._result = initDataPack;
        this._buffer = []; // Keeps snapshots of the history
        this._serverTime = initDataPack.timeStamp;
        this._clientTime = 0;
        this._size = 2;
    }

    get length() {
        return this._buffer.length;
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

    clientPrediction(data, entity, client) {

    }

    onServerUpdateReceived(data, entity, timeSyncer, client) {
        this._serverTime = data.timeStamp;
        this._clientTime = this._serverTime - INTERPOLATION_OFFSET;
        this.pushBack(data);
        if (this.length > this._size * 60) {
            this.popFront();
        }
        if (data._id === client.id) {
            this.clientPrediction(data, entity, client);
        }
    }

    // Run this in an entity's updateFromDataPack method
    updateFromServerFrame(data, entity, timeSyncer, client) {
        //this.t_directServerUpdate(data, entity);
        this.onServerUpdateReceived(data, entity, timeSyncer, client);
    }

    // Use client parameter to detect input
    updateFromClientFrame(deltaTime, entity, client, timeSyncer) {
    }

    remove(i) {
        this._buffer.splice(i);
    }


}