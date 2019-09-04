import CEntity from "./CEntity.js";
import R from "../../Graphics/Renderer.js";

export default class CBottle extends CEntity {
    draw() {
        let pos = this.getRealtimeProperty("pos");
        CEntity.defaultSprite.drawStill(this.getRealtimeProperty("type"),
            pos.x + R.camera.x,
            pos.y + R.camera.y - 2 , 8, 8);
    }
};

CEntity.defaultSprite.bind("ammo", 0, 0, 8, 8);
CEntity.defaultSprite.bind("charge", 8, 0, 8, 8);