import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AnimationManager from "../../../AssetManager/Classes/Graphical/AnimationManager.js";

export default class CPlayer extends CEntity {
    constructor(dataPack) {
        super(dataPack);
        this.animations = new AnimationManager();
        this.animations.addAnimation("run", new SpriteSheet.Animation(0, 5, 16, 0.1));
        this.animations.addAnimation("stand", new SpriteSheet.Animation(6, 6, 16, 0.1));
        this.animations.addAnimation("jump", new SpriteSheet.Animation(0, 0, 16, 0.1));
        this.animations.addAnimation("fall", new SpriteSheet.Animation(5, 5, 16, 0.1));
        this.animations.setCurrentAnimation("stand");
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.animations.setCurrentAnimation(this.output._movementState.main);
    }

    draw() {
        this.animations.animate(CPlayer.sprite, this.output._teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.output._movementState.direction === "left") {
            CPlayer.sprite.flipX();
        }
        CPlayer.sprite.drawAnimated(
            this.output._pos._x + R.camera.boundPos.x,
            this.output._pos._y + R.camera.boundPos.y);
        SpriteSheet.end();

        R.ctx.beginPath();
        R.ctx.moveTo(
            this.output._center._x + R.camera.boundPos.x,
            this.output._center._y + R.camera.boundPos.y);
        R.ctx.lineTo(
            this.output._t_scanPos._x + R.camera.boundPos.x,
            this.output._t_scanPos._y + R.camera.boundPos.y);
        R.ctx.strokeStyle = "white";
        R.ctx.stroke();
    }
}

CPlayer.sprite = new SpriteSheet("entity/player.png");
CPlayer.sprite.bind("red", 0, 0, 16 * 16, 16);
CPlayer.sprite.bind("blue", 0, 16, 16 * 16, 16);
CPlayer.sprite.bind("yellow", 0, 32, 16 * 16, 16);
CPlayer.sprite.bind("green", 0, 48, 16 * 16, 16);
CPlayer.sprite.setCentralOffset(4);

