import CLoot from "./CLoot.js";
import R from "../../Graphics/Renderer.js";

export default class CBottle extends CLoot {
    draw() {
        let pos = this.getRealtimeProperty("pos");
       /* CEntity.defaultSprite.drawStill(this.getRealtimeProperty("type"),
            pos.x + R.camera.x,
            pos.y + R.camera.y, 8, 8);*/
    }
};
