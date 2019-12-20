import OtherPlayer from "./OtherPlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import Scene from "../../Scene.js";
import AudioPool from "../../../AssetManager/Classes/Audio/AudioPool.js";
import CLoot from "../CLoot.js";
import CONMap from "../../../../../shared/code/DataStructures/CObjectNotationMap.js";
import CHitScanner from "./CHitScanner.js";


/**
 * The player the client controls. It contains the client side prediction code and the interface
 * for events happening only to the user end player entity.
 * @memberOf ClientSide

 */
class UserPlayer extends OtherPlayer {
    constructor(data) {
        super(data);
        this.serverState = data;
        this.localVel = new Vector2D(0, 0);
        this.localSides = {
            left: false,
            right: false,
            top: false,
            bottom: false,
            reset: () => {
                this.localSides.left = this.localSides.right = this.localSides.top = this.localSides.bottom = false;
            }
        };

        this.pickUpWeapon = false;

        this.itemScanner = new CHitScanner({}, false);
        this.itemsNearby = new CONMap();

        this.jumping = false;

        this.damageAudioSrc = "Player/damage_take.oggSE";

        Scene.clientRef.inputListener.addKeyMapping(32, (keyState) => {
            this.jumping = keyState;
        });
    }

    t_drawGhost() {
        R.ctx.save();
        R.ctx.globalAlpha = 0.4;
        //this.animations.animate(OtherPlayer.sprite, this.serverState.teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.serverState.movementState.direction === "left") {
            OtherPlayer.sprite.flipX();
        }
        OtherPlayer.sprite.drawAnimated(
            Math.round(this.serverState.pos.x) + R.camera.displayPos.x,
            Math.round(this.serverState.pos.y) + R.camera.displayPos.y);
        SpriteSheet.end();
        R.ctx.restore();
    }

    checkClosestItems() {
        for (var pair of Scene.entityManager.container) {
            let entity = pair[1];
            if (entity instanceof CLoot) {
                let entCenter = new Vector2D(entity.output.pos.x + entity.width / 2, entity.output.pos.y + entity.height / 2);
                let distance = Vector2D.distance(this.output.centerData, entCenter);
                if (entity.canPickUp(this) && distance < entity.PICK_UP_RANGE) {
                    if (entity.overlapLocalPlayer(Scene.clientRef)) {
                        this.itemsNearby.set(entity.output.id, distance);
                        break;
                    }
                    this.itemScanner.scan(this.output.centerData, entCenter, Scene.getCurrentTileMap());
                    if (CHitScanner.intersectsEntity(this.output.centerData, this.itemScanner.end, entity)) {
                        this.itemsNearby.set(entity.output.id, distance);
                    }
                }
            }
        }

        let closest = Math.min(...this.itemsNearby.array);
        for (let id in this.itemsNearby.object) {
            if (this.itemsNearby.get(id) === closest) {
                Scene.entityManager.getEntityByID(id).isClose = true;
                break;
            }
        }
        this.itemsNearby.clear();
    }

    hasWeapon() {
        return !!this.weapon;
    }

    update(deltaTime, client, currentMap) {
        super.update(deltaTime, client);
        this.currentMap = currentMap;
        this.weapon = Scene.entities.getEntityByID(this.output.invWeaponID);
        if (R.camera.config("followPlayer")) {
            R.camera.setCurrentFollowPos(this.getRealtimeProperty("centerData"));
        }
        if (this.weapon && !this.pickUpWeapon) {
            AudioPool.play("Player/pickup_weapon.oggSE");
            this.pickUpWeapon = true;
        }

        if (!this.weapon && this.pickUpWeapon) {
            AudioPool.play("Player/drop.oggSE");
            this.pickUpWeapon = false;
        }

        R.camera.setConfig("followPlayer", true);
        if (!this.hasWeapon()) {
            this.checkClosestItems();
        }
    }
}

export default UserPlayer;