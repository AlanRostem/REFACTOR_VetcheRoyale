import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AssetManager from "../../../AssetManager/AssetManager.js";

export default class CWeapon extends CEntity {
    constructor(data, iconID) {
        super(data);
        this.iconID = iconID;

    }

    onFire(client, deltaTime) {

    }

    onDrop(client, deltaTime) {

    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        if (this.getRealtimeProperty("firing") && this.getRealtimeProperty("equippedToPlayer")) {
            this.onFire(client, deltaTime);
        }

        if (this.getRealtimeProperty("dropped")) {
            this.onDrop(client, deltaTime);
        }
    }

    draw() {
        if (!this.getRealtimeProperty("equippedToPlayer")) {
            let name = this.getRealtimeProperty("displayName") + "_world";
            let pos = this.getRealtimeProperty("pos");
            let h = this.getRealtimeProperty("height");

            R.drawCroppedImage(
                AssetManager.getMapImage(name),
                0,
                0,
                16,
                8,
                pos.x - 4 + R.camera.x,
                pos.y - 2 + R.camera.y,
                16,
                8
            );
        }
    }
}