// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Vector2D from "../../../../shared/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/Math/CCustomMath.js";
import Constants from "../../../../shared/Constants.js";
import MyClient from "../../Networking/MyClient.js"
import EntitySnapshotBuffer from "./Management/EntitySnapshotBuffer.js";
import Scene from "../Scene.js"


export default class CEntity {
        constructor(initDataPack) {
        this._displayPos = new Vector2D(initDataPack._pos._x, initDataPack._pos._y);

        this._serverState = initDataPack;
        this._targetState = initDataPack;

        this._dataBuffer = new EntitySnapshotBuffer(Constants.MAX_ENTITY_BUFFER_SIZE, initDataPack);

        // TODO: Initialize constants in a better way
        this._t_entityProximity = this._targetState._t_entityProximity;
        this._color = this._targetState._color;
        this._width = this._targetState._width;
        this._height = this._targetState._height;
    }

    set serverState(val) {
        this._serverState = val;
    }

    get serverState() {
        return this._serverState;
    }

    set targetState(val) {
        this._targetState = val;
    }

    get targetState() {
        return this._targetState;
    }

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack, client) {
        //this._dataBuffer.updateFromServerFrame(dataPack, this)
        this._targetState = dataPack;
    }

    update(deltaTime) {
        //this._dataBuffer.updateFromClientFrame(deltaTime, this, undefined);
        /*
        var deltaX = (this._targetState.pos._x - this._displayPos.x);
        this._displayPos.x += deltaX * deltaTime * 10 | 0;

        var deltaY = (this._targetState.pos._y - this._displayPos.y);
        this._displayPos.y += deltaY * deltaTime * 10 | 0;
        */

        // this._displayPos.x = this._targetState._pos._x;
        // this._displayPos.y = this._targetState._pos._y;
    }

    draw() {
        if (this._targetState._qtBounds) {
            var rect = this._targetState._qtBounds;
            R.ctx.strokeStyle = "red";
            R.ctx.strokeRect(
                rect.x - rect.w + R.camera.boundPos.x,
                rect.y - rect.h + R.camera.boundPos.y,
                rect.w * 2, rect.h * 2);
        }
        R.drawRect(this._color,
            this._targetState._pos._x /*+ (this._targetState._vel._x * Scene.deltaTime | 0) */,
            this._targetState._pos._y /*+ (this._targetState._vel._y * Scene.deltaTime | 0) */,
            this._width, this._height, true);
    }
}