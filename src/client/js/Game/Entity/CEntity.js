// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Vector2D from "../../../../shared/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../shared/Math/CCustomMath.js";
import EntityDataBuffer from "./Management/EntityDataBuffer.js";
import Constants from "../../../../shared/Constants";


export default class CEntity {
    constructor(initDataPack) {

        this._dataBuffer = new EntityDataBuffer(Constants.MAX_ENTITY_BUFFER_SIZE);

        this._disPlayPos = new Vector2D(0, 0);
        this._targetState = initDataPack;

        // TODO: Initialize constants in a better way
        this.t_entityProximity = this._targetState.t_entityProximity;
        this.color = this._targetState.color;
        this.width = this._targetState.width;
        this.height = this._targetState.height;
    }

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack) {
        this._targetState = dataPack;
        this._dataBuffer.update(dataPack, dataPack.serverTickDeltaTime);
    }

    // Lag compensation
    clientProcessCorrection() {
        var latestData = this._dataBuffer.get(this._dataBuffer.length - 1);

        var currentPos = latestData.pos;


    }

    update(deltaTime) {
        this._disPlayPos.x = this._targetState.pos._x | 0;
        this._disPlayPos.y = this._targetState.pos._y | 0;
    }

    draw() {
        R.drawRect(this.color, this._disPlayPos.x, this._disPlayPos.y, this.width, this.height);

        // TEST:
        R.context.save();
        R.context.beginPath();
        R.context.arc(this._disPlayPos.x + this.width / 2, this._disPlayPos.y + this.width / 2, this.t_entityProximity, 0, Math.PI * 2);
        R.context.strokeStyle = "yellow";
        R.context.lineWidth = 2;
        R.context.stroke();
        R.context.restore();
    }
}