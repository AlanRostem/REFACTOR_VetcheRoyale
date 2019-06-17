// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Vector2D from "../../../../shared/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/Math/CCustomMath.js";
import Constants from "../../../../shared/Constants.js";
import MyClient from "../../Networking/MyClient.js"

export default class CEntity {
    constructor(initDataPack) {
        this._displayPos = new Vector2D(initDataPack.pos._x, initDataPack.pos._y);

        this._targetState = initDataPack;

        // TODO: Initialize constants in a better way
        this.t_entityProximity = this._targetState.t_entityProximity;
        this.color = this._targetState.color;
        this.width = this._targetState.width;
        this.height = this._targetState.height;
    }

    isPosInit = false;

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack) {
        this._targetState = dataPack;
    }

    update(deltaTime) {
        var deltaX = (this._targetState.pos._x - this._displayPos.x);
        this._displayPos.x += deltaX * deltaTime * 10 | 0;

        var deltaY = (this._targetState.pos._y - this._displayPos.y);
        this._displayPos.y += deltaY * deltaTime * 10 | 0;

    }


    draw() {
        R.drawRect(this.color, this._displayPos.x, this._displayPos.y, this.width, this.height, true);

        // TEST:
        R.context.save();
        R.context.beginPath();
        R.context.arc(
            this._displayPos.x + R.camera.boundPos.x + this.width / 2,
            this._displayPos.y + R.camera.boundPos.y + this.width / 2,
            this.t_entityProximity, 0, Math.PI * 2);
        R.context.strokeStyle = "yellow";
        R.context.lineWidth = 2;
        R.context.stroke();
        R.context.restore();
    }
}