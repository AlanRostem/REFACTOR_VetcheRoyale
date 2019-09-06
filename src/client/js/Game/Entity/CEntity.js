// Client side entity instance. Used for rendering
// and other potential entity management on the client.
import R from "../../Graphics/Renderer.js"
import Constants from "../../../../shared/code/Tools/Constants.js";
import EntitySnapshotBuffer from "../../Networking/Interpolation/EntitySnapshotBuffer.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";

export default class CEntity {
    constructor(initDataPack) {
        this.output = initDataPack;

        this.dataBuffer = new EntitySnapshotBuffer(initDataPack);

        // TODO: Initialize constants in a better way
        this.color = this.output.color;
        this.width = this.output.width;
        this.height = this.output.height;
    }

    // This function is run from the client emit callback.
    updateFromDataPack(dataPack, client) {
        this.dataBuffer.updateFromServerFrame(dataPack, this, client);
    }

    update(deltaTime, client) {
        //this.dataBuffer.updateFromClientFrame(deltaTime, this, client);
    }

    // Returns the property value of the entity based on correct
    // interpolations in sync with the server.
    getRealtimeProperty(string) {
        return this.output[string];
    }

    onClientSpawn(dataPack, client) {

    }

    onClientDelete(client) {

    }

    draw() {
        R.drawRect(this.color,
            this.output.pos.x /*+ (this.output.vel.x * Scene.deltaTime | 0) */,
            this.output.pos.y /*+ (this.output.vel.y * Scene.deltaTime | 0) */,
            this.width, this.height, true);
        /*

        R.drawText(this.output.eType,
            this.output.pos.x - R.ctx.measureText(this.output.eType).width / 4,
            this.output.pos.y, "Blue", true);
    */
    }
}

CEntity.defaultSprite = new SpriteSheet("entity/entities.png");