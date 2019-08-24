import CEntity from "./CEntity.js";
import R from "../../Graphics/Renderer.js";

export default class CBottle extends CEntity {
    draw() {
        let pos = this.getRealtimeProperty("_pos");
        CEntity.defaultSprite.drawStill(this.getRealtimeProperty("_type"),
            pos._x + R.camera.x,
            pos._y + R.camera.y - 2, 8, 8);
    }
};

CEntity.defaultSprite.bind("ammo", 0, 0, 8, 8);
CEntity.defaultSprite.bind("charge", 8, 0, 8, 8);