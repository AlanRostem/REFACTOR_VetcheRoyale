import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AnimationManager from "../../../AssetManager/Classes/Graphical/AnimationManager.js";

// Other players in the game

export default class RemotePlayer extends CEntity {
    constructor(dataPack) {
        super(dataPack);
        this.animations = new AnimationManager();
        this.animations.addAnimation("run", new SpriteSheet.Animation(0, 5, 16, 0.1));
        this.animations.addAnimation("stand", new SpriteSheet.Animation(6, 6, 16, 0.1));
        this.animations.addAnimation("jump", new SpriteSheet.Animation(0, 0, 16, 0.1));
        this.animations.addAnimation("fall", new SpriteSheet.Animation(5, 5, 16, 0.1));
        this.animations.setCurrentAnimation("stand");
    }


    update(deltaTime, client, timeSyncer) {
        super.update(deltaTime, client, timeSyncer);
        this.animations.setCurrentAnimation(this.output._movementState.main);
        this._output._center._x = this._output._pos._x + this._width / 2;
        this._output._center._y = this._output._pos._y + this._height / 2;
    }



    draw() {
        this.animations.animate(RemotePlayer.sprite, this.output._teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.output._movementState.direction === "left") {
            RemotePlayer.sprite.flipX();
        }
        RemotePlayer.sprite.drawAnimated(
            Math.round(this.output._pos._x) + R.camera.boundPos.x,
            Math.round(this.output._pos._y) + R.camera.boundPos.y);
        SpriteSheet.end();
    }
}

RemotePlayer.sprite = new SpriteSheet("entity/player.png");
RemotePlayer.sprite.bind("red", 0, 0, 16 * 16, 16);
RemotePlayer.sprite.bind("blue", 0, 16, 16 * 16, 16);
RemotePlayer.sprite.bind("yellow", 0, 32, 16 * 16, 16);
RemotePlayer.sprite.bind("green", 0, 48, 16 * 16, 16);
RemotePlayer.sprite.setCentralOffset(4);

