import R from "../../Graphics/Renderer.js"
import Constants from "../../../../shared/code/Tools/Constants.js";
import EntitySnapshotBuffer from "../../Networking/Interpolation/EntitySnapshotBuffer.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";


/**
 * The visual representation of entities present on the server.
 * @memberOf ClientSide
 */
class CEntity {
    /**
     * @param initDataPack {object} - Initial packet data sent by the server. Constructor is called when the server emits
     * the 'initEntity' or 'spawnEntity' socket event.
     */
    constructor(initDataPack) {
        /**
         * The output entity data to be used around the entire client side application. This data will be tuned
         * from client prediction, server reconciliation and entity interpolation.
         * @type {Object}
         */
        this.output = {};
        this.consts = initDataPack.init;
        for (let key in initDataPack.dynamic) {
            this.output[key] = initDataPack.dynamic[key];
        }
        for (let key in this.consts) {
            this.output[key] = this.consts[key];
        }

        /**
         * Packet buffer tuning the entity data
         * @type {EntitySnapshotBuffer}
         */
        this.dataBuffer = new EntitySnapshotBuffer(initDataPack);

        this.color = "white";//this.output.color;
        this.width = this.output.width;
        this.height = this.output.height;
    }

    /**
     * Method called every server tick (with latency)
     * @param dataPack {object} - Packet data sent every server tick
     * @param client {CClient} - Reference to the end user object
     * @see CClient
     */
    updateFromDataPack(dataPack, client) {
        this.color = this.output.color;
        this.width = this.output.width;
        this.height = this.output.height;
        //this.dataBuffer.updateFromServerFrame(dataPack, this, client);
        for (let key in dataPack) {
            this.output[key] = dataPack[key];
        }
    }

    /**
     * Method called every client tick in the game loop on the Scene object
     * @param deltaTime {number} - Time between every frame on the client
     * @param client {CClient} - Reference to the end user object
     * @see Scene
     */
    update(deltaTime, client) {
        //this.dataBuffer.updateFromClientFrame(deltaTime, this, client);
    }

    /**
     * Returns the property value of the entity based on correct interpolations in sync with the server (output property).
     * @param string {string} - Property name
     * @returns {object}
     */
    getRealtimeProperty(string) {
        return this.output[string];
    }

    /**
     * Overridable event called when the entity shows up on the client
     * @param dataPack {object} - Initial data pack (shows up in constructor too)
     * @param client {CClient} - Reference to the end user object
     */
    onClientSpawn(dataPack, client) {

    }

    /**
     * Overridable event called when the entity is removed on the server.
     * @param client {CClient} - Reference to the end user object
     */
    onClientDelete(client) {

    }

    overlapLocalPlayer(client) {
        if (client.player) {
            if (this.output.id === client.player.id)
                return false;
            let e = client.player;
            return this.output.pos.y + this.height > e.output.pos.y
                && this.output.pos.y < (e.output.pos.y + e.height)
                && this.output.pos.x + this.width > e.output.pos.x
                && this.output.pos.x < (e.output.pos.x + e.width);
        }
    }

    /**
     * Overridable event called every frame in the game loop. Do custom drawing here.
     */
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

export default CEntity;