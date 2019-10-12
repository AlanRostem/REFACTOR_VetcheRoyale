import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";

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
            let name = this.getRealtimeProperty("displayName") + "-World";
            let rect = CWeapon.sprite.offsetRects.get(name);
            if (rect) {
                let pos = this.getRealtimeProperty("pos");
                let h = this.getRealtimeProperty("height");
                CWeapon.sprite.drawStill(name,
                    pos.x - 4 + R.camera.x,
                    pos.y + R.camera.y - Math.abs(rect.h - h));
            } else {
                let pos = this.getRealtimeProperty("pos");
                let h = this.getRealtimeProperty("height");
                rect = CWeapon.sprite.offsetRects.get("none");
                CWeapon.sprite.drawStill("none",
                    pos.x - rect.w / 2 + R.camera.x,
                    pos.y + R.camera.y - Math.abs(rect.h - h));
            }
        }
    }
}

CWeapon.sprite = new SpriteSheet("entity/guns.png");
CWeapon.sprite.bind("KE-6H-World", 64, 40, 16, 8);
CWeapon.sprite.bind("C-KER .90-World", 64, 96, 16, 8);
CWeapon.sprite.bind("SEW-9-World", 64, 64, 16, 8);
CWeapon.sprite.bind("Interlux-World", 64, 76, 16, 8);
CWeapon.sprite.bind("none", 64, 52, 27, 12);