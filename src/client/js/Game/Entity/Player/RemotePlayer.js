import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AnimationManager from "../../../AssetManager/Classes/Graphical/AnimationManager.js";
import AssetManager from "../../../AssetManager/AssetManager.js"

/**
 * Other players in the game. Overrides update and draw methods of CEntity and contains sprite
 * and animation data.
 * @see CEntity
 * @memberOf ClientSide
 */
class RemotePlayer extends CEntity {
    constructor(dataPack) {
        super(dataPack);
        this.animations = new AnimationManager();
        this.animations.addAnimation("run", new SpriteSheet.Animation(0, 5, 16, 0.1));
        this.animations.addAnimation("stand", new SpriteSheet.Animation(6, 6, 16, 0.1));
        this.animations.addAnimation("jump", new SpriteSheet.Animation(0, 0, 16, 0.1));
        this.animations.addAnimation("fall", new SpriteSheet.Animation(5, 5, 16, 0.1));
        this.animations.setCurrentAnimation("stand");
        this.movementState = {};
        this.deltaPos = {x: 0, y: 0};
        this.prevPos = {x: 0, y: 0};
        this.side = {
            left: false,
            right: false,
            top: false,
            bottom: false,
        };
    }

    setMovementState(key, value) {
        this.movementState[key] = value;
    }

    checkMovementState(key, value) {
        return this.movementState[key] === value;
    }

    onTileOverlap(ID, pos) {
        //TODO: Fix this hack by making tile data global on server and client
        if (ID === 14 || ID === 13) {
            this.setMovementState("slope", "true");
            this.wasOnSlope = 0;
        }
    }

    updateFromDataPack(dataPack, client) {
        this.prevPos.x = this.output.pos.x;
        this.prevPos.y = this.output.pos.y;
        super.updateFromDataPack(dataPack, client);
        this.deltaPos.x = this.output.pos.x - this.prevPos.x;
        this.deltaPos.y = this.output.pos.y - this.prevPos.y;
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        this.checkTileOverlaps(Scene.getCurrentTileMap());

        let self = this.output;
        if (self.vel.x !== 0) {
            if (this.output.effectsData.KnockBackEffect) {
                if (this.output.effectsData.KnockBackEffect.length === 0) {
                    this.setMovementState("main", "run");
                }
            } else {
                this.setMovementState("main", "run");
            }
        } else {
            this.setMovementState("main", "stand");
        }

        if (this.checkMovementState("main", "run")) {
            if (self.vel.x > 0) {
                this.setMovementState("direction", "right");
            }

            if (self.vel.x < 0) {
                this.setMovementState("direction", "left");
            }
        }

        if (!this.checkMovementState("slope", "true")) {
            if (self.vel.y < 0) {
                this.setMovementState("main", "jump");
            } else if (self.vel.y > 0) {
                this.setMovementState("main", "fall");
            }
        }

        if (this.movementState.main) {
            this.animations.setCurrentAnimation(this.movementState.main);
        }

        // TODO: Set movement states based on effect data (such as knock-back) from the server.

        // TODO: Drittløsning
        if (this.wasOnSlope >= 3) {
            this.setMovementState("slope", "false");
        } else {
            this.wasOnSlope++;
        }
    }

    draw() {
        this.animations.animate(RemotePlayer.sprite, this.output.teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.movementState.direction === "left") {
            RemotePlayer.sprite.flipX();
        }
        RemotePlayer.sprite.drawAnimated(
            Math.round(this.output.pos.x) + R.camera.displayPos.x,
            Math.round(this.output.pos.y) + R.camera.displayPos.y);
        SpriteSheet.end();
    }
}

RemotePlayer.sprite = new SpriteSheet("playerSprite");


RemotePlayer.sprite.bind("red", 0, 0, 16 * 16, 16);
RemotePlayer.sprite.bind("blue", 0, 16, 16 * 16, 16);
RemotePlayer.sprite.bind("yellow", 0, 32, 16 * 16, 16);
RemotePlayer.sprite.bind("green", 0, 48, 16 * 16, 16);
RemotePlayer.sprite.setCentralOffset(4);

export default RemotePlayer;