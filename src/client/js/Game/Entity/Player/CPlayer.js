import CEntity from "../CEntity.js";
import AssetManager from "../../../AssetManager/AssetManager.js"
import SpriteSheet from "../../../AssetManager/Classes/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";

export default class CPlayer extends CEntity {
    constructor(dataPack) {
        super(dataPack);
    }

    draw() {
        super.draw();
        CPlayer.sprite.animate("green", CPlayer.walkAnim, 16, 16);

        SpriteSheet.beginChanges();
        if (this.output._vel._x < 0) {
            CPlayer.sprite.flipX();
        }
        CPlayer.sprite.drawAnimated(
            this.output._pos._x + R.camera.boundPos.x,
            this.output._pos._y + R.camera.boundPos.y);
        SpriteSheet.end();
    }
}

CPlayer.sprite = new SpriteSheet("entity/player.png");
CPlayer.sprite.bind("red", 0, 0, 16 * 16, 16);
CPlayer.sprite.bind("blue", 0, 16, 16 * 16, 16);
CPlayer.sprite.bind("yellow", 0, 32, 16 * 16, 16);
CPlayer.sprite.bind("green", 0, 48, 16 * 16, 16);
CPlayer.sprite.setCentralOffset(4);

CPlayer.walkAnim = new SpriteSheet.Animation(0, 5, 16, 0.13);