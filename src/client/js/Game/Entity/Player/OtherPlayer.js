import CEntity from "../CEntity.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../Graphics/Renderer.js";
import AnimationManager from "../../../AssetManager/Classes/Graphical/AnimationManager.js";
import AssetManager from "../../../AssetManager/AssetManager.js"
import Scene from "../../Scene.js";
import AudioPool from "../../../AssetManager/Classes/Audio/AudioPool.js";
import Timer from "../../../../../shared/code/Tools/CTimer.js";


/**
 * Other players in the game. Overrides update and draw methods of CEntity and contains sprite
 * and animation data.
 * @see CEntity
 * @memberOf ClientSide
 */
class OtherPlayer extends CEntity {
    constructor(dataPack) {
        super(dataPack);
        this.animations = new AnimationManager();
        this.animations.addAnimation("run", new SpriteSheet.Animation(0, 5, 16, 0.1));
        this.animations.addAnimation("stand", new SpriteSheet.Animation(6, 6, 16, 0.1));
        this.animations.addAnimation("jump", new SpriteSheet.Animation(0, 0, 16, 0.1));
        this.animations.addAnimation("fall", new SpriteSheet.Animation(3, 3, 16, 0.1));
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
        this.timer = new Timer(0.4, () => {
            this.footStep = true;
            this.footCount = (Math.random() * 3 | 0) + 1;
        }, true);
        this.jumpSound = false;

        this.timer2 = new Timer(0.1, ()=> {
            this.applyDmg = false;
        });

        this.applyDmg = false;
        this.preHP = 100;

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
        this.timer.tick(deltaTime);

        let self = this.output;

        if(self.hp < this.preHP) { this.preHP = self.hp; this.applyDmg = true;}

        if(this.applyDmg) {
            this.timer2.tick(deltaTime);
        }

        if (self.vel.x !== 0 && self.vel.x !== undefined) {
            if (this.output.effectsData)
                if (this.output.effectsData.KnockBackEffect) {
                    if (this.output.effectsData.KnockBackEffect.length === 0) {
                        this.setMovementState("main", "run");
                    }
                } else {
                    this.setMovementState("main", "run");
                }
        } else {
            if (!this.jumping) this.setMovementState("main", "stand");
            else this.setMovementState("main", "jump")
        }


        if (this.checkMovementState("main", "run")) {
            if (self.vel.x > 0) {
                if (this.output.effectsData) {
                    if (this.output.effectsData.KnockBackEffect) {
                        if (this.output.effectsData.KnockBackEffect.length === 0)
                            this.setMovementState("direction", "right");
                    } else {
                        this.setMovementState("direction", "right");
                    }
                } else {
                    this.setMovementState("direction", "right");
                }
            }

            if (self.vel.x < 0) {
                if (this.output.effectsData) {
                    if (this.output.effectsData.KnockBackEffect) {
                        if (this.output.effectsData.KnockBackEffect.length === 0)
                            this.setMovementState("direction", "left");
                    } else {
                        this.setMovementState("direction", "left");
                    }
                } else {
                    this.setMovementState("direction", "left");
                }
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

        if (this.checkMovementState("main", "run")) {
            if (this.footStep) {
                AudioPool.play("Player/footStep_" + this.footCount + ".oggSE")
                .updatePanPos(this.output.pos);
                this.footStep = false;
            }
            this.footStep = false;
        } else this.footStep = false;


        if (this.checkMovementState("main", "jump")) {
            if (!this.jumpSound) {
                AudioPool.play("Player/jump_land.oggSE")
                    .updatePanPos(this.output.pos);
                this.jumpSound = true;
            }
        } else {
            this.jumpSound = false;
        }
    }

    draw() {
        if(OtherPlayer.sprite !== OtherPlayer.normal && !this.applyDmg) OtherPlayer.sprite = OtherPlayer.normal;

        else if(this.applyDmg) {
            if(this.output.hp > 70) OtherPlayer.sprite = OtherPlayer.highDamage;
            else if(this.output.hp > 25) OtherPlayer.sprite = OtherPlayer.medDamage;
            else OtherPlayer.sprite = OtherPlayer.lowDamage;
        }

        if(OtherPlayer.sprite === OtherPlayer.normal) this.animations.animate(OtherPlayer.sprite, this.output.teamName, 16, 16);
        else this.animations.animate(OtherPlayer.sprite, "hurt", 16, 16);
        SpriteSheet.beginChanges();
        if (this.movementState.direction === "left") {
            OtherPlayer.sprite.flipX();
        }
        OtherPlayer.sprite.drawAnimated(
            Math.round(this.output.pos.x) + R.camera.displayPos.x,
            Math.round(this.output.pos.y) + R.camera.displayPos.y);
        SpriteSheet.end();
    }
}


OtherPlayer.normal = new SpriteSheet("playerSprite");

OtherPlayer.sprite = OtherPlayer.normal;

OtherPlayer.lowDamage = new SpriteSheet("playerLowHP");
OtherPlayer.medDamage = new SpriteSheet("playerMedHP");
OtherPlayer.highDamage = new SpriteSheet("playerHighHP");

OtherPlayer.normal.bind("red", 0, 0, 16 * 16, 16);
OtherPlayer.normal.bind("blue", 0, 16, 16 * 16, 16);
OtherPlayer.normal.bind("yellow", 0, 32, 16 * 16, 16);
OtherPlayer.normal.bind("green", 0, 48, 16 * 16, 16);

OtherPlayer.lowDamage.bind("hurt", 0, 0, 16 * 16, 16);
OtherPlayer.medDamage.bind("hurt", 0, 0, 16 * 16, 16);
OtherPlayer.highDamage.bind("hurt", 0, 0, 16 * 16, 16);

OtherPlayer.normal.setCentralOffset(4);
OtherPlayer.lowDamage.setCentralOffset(4);
OtherPlayer.medDamage.setCentralOffset(4);
OtherPlayer.highDamage.setCentralOffset(4);

export default OtherPlayer;