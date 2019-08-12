// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Constants from "../../../../shared/code/Tools/Constants.js";
import EntitySnapshotBuffer from "../../Networking/Interpolation/EntitySnapshotBuffer.js";

export default class CEntity {
    constructor(initDataPack) {
        this._output = initDataPack;

        this._dataBuffer = new EntitySnapshotBuffer(initDataPack);

        // TODO: Initialize constants in a better way
        this._color = this._output._color;
        this._width = this._output._width;
        this._height = this._output._height;
    }

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack, client , timeSyncer) {
        this._dataBuffer.updateFromServerFrame(dataPack, this, timeSyncer, client);
    }

    update(deltaTime, timeSyncer) {
        this._dataBuffer.updateFromClientFrame(deltaTime, this, undefined, timeSyncer);
    }

    get output() {
        return this._output;
    }

    // Returns the property value of the entity based on correct
    // interpolations in sync with the server.
    getRealtimeProperty(string) {
        return this._output[string];
    }

    onClientSpawn(dataPack, client) {

    }

    onClientDelete(client) {

    }

    draw() {
        R.drawRect(this._color,
            this._output._pos._x /*+ (this._output._vel._x * Scene.deltaTime | 0) */,
            this._output._pos._y /*+ (this._output._vel._y * Scene.deltaTime | 0) */,
            this._width, this._height, true);
        R.drawText(this._output._eType,
            this._output._pos._x - R.ctx.measureText(this._output._eType).width / 4,
            this._output._pos._y, "blue", true);
    }
}