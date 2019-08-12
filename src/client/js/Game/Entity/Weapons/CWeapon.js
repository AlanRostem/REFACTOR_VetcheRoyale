import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";

export default class CWeapon extends CEntity {
    constructor(data) {
        super(data);
    }

    draw() {
        if (!this.getRealtimeProperty("_equippedToPlayer")) {
            let pos = this.getRealtimeProperty("_pos");
            let name = this.getRealtimeProperty("_displayName") + "-World";
            let h = this.getRealtimeProperty("_height");
            let rect = CWeapon.sprite.offsetRects.get(name);
            if (rect) {
                CWeapon.sprite.drawStill(name,
                    pos._x - rect.w / 2 + R.camera.x,
                    pos._y + R.camera.y - Math.abs(rect.h - h));
            }
        }
    }
}

CWeapon.sprite = new SpriteSheet("entity/guns.png");
CWeapon.sprite.bind("KE-6H-World", 64, 37, 28, 11);