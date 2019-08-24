import CEntity from "./CEntity.js";
import SpriteSheet from "../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../Graphics/Renderer.js";

export default class CPortal extends CEntity {
    constructor(d) {
        super(d);
        this.animation = new SpriteSheet.Animation(0, 3, 4, 0.4);
    }

    draw() {
        super.draw();
        let pos = this.getRealtimeProperty("_pos");
        /*
        CEntity.defaultSprite.drawStill("portal",
            pos._x + R.camera.x - 3,
            pos._y + R.camera.y,
            16, 16);
        */
        CEntity.defaultSprite.animate("portal", this.animation, 16, 16);
        CEntity.defaultSprite.drawAnimated(
            pos._x + R.camera.x - 3,
            pos._y + R.camera.y, 16, 16);
    }
};

CEntity.defaultSprite.bind("portal", 0, 16, 16 * 4, 16);