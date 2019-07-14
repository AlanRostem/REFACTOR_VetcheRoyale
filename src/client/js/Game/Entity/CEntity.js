// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Constants from "../../../../shared/code/Tools/Constants.js";
import EntitySnapshotBuffer from "./Management/EntitySnapshotBuffer.js";


export default class CEntity {
    constructor(initDataPack) {
        this._output = initDataPack;

        this._dataBuffer = new EntitySnapshotBuffer(Constants.MAX_ENTITY_BUFFER_SIZE, initDataPack);

        // TODO: Initialize constants in a better way
        this._t_entityProximity = this._output._t_entityProximity;
        this._color = this._output._color;
        this._width = this._output._width;
        this._height = this._output._height;
    }

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack, client) {
        //this._dataBuffer.updateFromServerFrame(dataPack, this)
        this._output = dataPack;
    }

    get output() {
        return this._output;
    }

    update(deltaTime) {
        //this._dataBuffer.updateFromClientFrame(deltaTime, this, undefined);
        /*
        var deltaX = (this._output.pos._x - this._displayPos.x);
        this._displayPos.x += deltaX * deltaTime * 10 | 0;

        var deltaY = (this._output.pos._y - this._displayPos.y);
        this._displayPos.y += deltaY * deltaTime * 10 | 0;
        */

        // this._displayPos.x = this._output._pos._x;
        // this._displayPos.y = this._output._pos._y;
    }

    draw() {
        R.drawRect(this._color,
            this._output._pos._x /*+ (this._output._vel._x * Scene.deltaTime | 0) */,
            this._output._pos._y /*+ (this._output._vel._y * Scene.deltaTime | 0) */,
            this._width, this._height, true);
        R.drawText(this._output._eType,
            this._output._pos._x - R.ctx.measureText(this._output._eType).width / 4,
            this._output._pos._y, "white", true);
    }
}