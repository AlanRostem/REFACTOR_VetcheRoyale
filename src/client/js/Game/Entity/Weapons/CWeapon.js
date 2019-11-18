import CLoot from "../CLoot.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AssetManager from "../../../AssetManager/AssetManager.js";

export default class CWeapon extends CLoot {
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
            if (!this.isClose) {
                let name = this.getRealtimeProperty("displayName") + "_world";
                let pos = this.getRealtimeProperty("pos");

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
            } else {
                let name = this.getRealtimeProperty("displayName") + "_world_selected";
                let pos = this.getRealtimeProperty("pos");

                R.drawText("[E]", pos.x - 3, pos.y + 9, "White", true);
                R.drawCroppedImage(
                    AssetManager.getMapImage(name),
                    0,
                    0,
                    AssetManager.getMapImage(name).width,
                    AssetManager.getMapImage(name).height,
                    pos.x - 4 + R.camera.x,
                    pos.y - 3 + R.camera.y,
                    AssetManager.getMapImage(name).width,
                    AssetManager.getMapImage(name).height
                );
            }
        }

    }
}