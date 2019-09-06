import CEntity from "./CEntity.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../Graphics/Renderer.js";

export default class CPortal extends CEntity {
    constructor(d) {
        super(d);
        this.animation = new SpriteSheet.Animation(0, 3, 4, 0.1);
    }

    draw() {
        let pos = this.getRealtimeProperty("pos");
        CEntity.defaultSprite.animate("portal", this.animation, 10, 16);
        CEntity.defaultSprite.drawAnimated(
            pos.x + R.camera.x,
            pos.y + R.camera.y - 3, 10, 16);
    }
};

CEntity.defaultSprite.bind("portal", 0, 8, 10 * 4, 16);