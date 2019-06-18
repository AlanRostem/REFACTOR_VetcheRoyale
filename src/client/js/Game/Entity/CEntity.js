// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Vector2D from "../../../../shared/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/Math/CCustomMath.js";
import Constants from "../../../../shared/Constants.js";
import MyClient from "../../Networking/MyClient.js"

export default class CEntity {
    constructor(initDataPack) {
        this._displayPos = new Vector2D(initDataPack._pos._x, initDataPack._pos._y);

        this._targetState = initDataPack;

        // TODO: Initialize constants in a better way
        this._t_entityProximity = this._targetState._t_entityProximity;
        this._color = this._targetState._color;
        this._width = this._targetState._width;
        this._height = this._targetState._height;
    }

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack) {
        this._targetState = dataPack;
    }

    update(deltaTime) {
        /*
        var deltaX = (this._targetState.pos._x - this._displayPos.x);
        this._displayPos.x += deltaX * deltaTime * 10 | 0;

        var deltaY = (this._targetState.pos._y - this._displayPos.y);
        this._displayPos.y += deltaY * deltaTime * 10 | 0;
        */

        this._displayPos.x = this._targetState._pos._x;
        this._displayPos.y = this._targetState._pos._y;
    }

    draw() {
        R.drawRect(this._color, this._targetState._pos._x, this._targetState._pos._y, this._width, this._height, true);

        // TEST:
        R.context.save();
        R.context.beginPath();
        R.context.arc(
            this._targetState._pos.x + R.camera.boundPos.x + this._width / 2,
            this._targetState._pos.y + R.camera.boundPos.y + this._width / 2,
            this._t_entityProximity, 0, Math.PI * 2);
        R.context.strokeStyle = "yellow";
        R.context.lineWidth = 2;
        R.context.stroke();
        R.context.restore();
    }
}