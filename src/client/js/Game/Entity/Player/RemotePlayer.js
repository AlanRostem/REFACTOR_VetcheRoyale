import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AnimationManager from "../../../AssetManager/Classes/Graphical/AnimationManager.js";
import AssetManager from "../../../AssetManager/AssetManager.js"

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


    update(deltaTime, client) {
        super.update(deltaTime, client);
        this.animations.setCurrentAnimation(this.output.movementState.main);
        this.output.centerData.x = this.output.pos.x + this.width / 2;
        this.output.centerData.y = this.output.pos.y + this.height / 2;
    }

    draw() {
        this.animations.animate(RemotePlayer.sprite, this.output.teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.output.movementState.direction === "left") {
            RemotePlayer.sprite.flipX();
        }
        RemotePlayer.sprite.drawAnimated(
            Math.round(this.output.pos.x) + R.camera.boundPos.x,
            Math.round(this.output.pos.y) + R.camera.boundPos.y);
        SpriteSheet.end();
    }
}

RemotePlayer.sprite = new SpriteSheet("entity/player.png");

AssetManager.mapFilePathCallback("entity/player.png", cache => {
    console.log("GG we loaded in entity/player.png");
});

RemotePlayer.sprite.bind("red", 0, 0, 16 * 16, 16);
RemotePlayer.sprite.bind("blue", 0, 16, 16 * 16, 16);
RemotePlayer.sprite.bind("yellow", 0, 32, 16 * 16, 16);
RemotePlayer.sprite.bind("green", 0, 48, 16 * 16, 16);
RemotePlayer.sprite.setCentralOffset(4);

