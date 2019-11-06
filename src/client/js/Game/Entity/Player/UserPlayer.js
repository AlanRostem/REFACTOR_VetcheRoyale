import RemotePlayer from "./RemotePlayer.js";
import R from "../../../Graphics/Renderer.js";
import SpriteSheet from "../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import Scene from "../../Scene.js";


const TILE_SIZE = 8;


/**
 * The player the client controls. It contains the client side prediction code and the interface
 * for events happening only to the user end player entity.
 * @memberOf ClientSide

 */
class UserPlayer extends RemotePlayer {
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

        this.jumping = false;

        Scene.clientRef.inputListener.addKeyMapping(32, (keyState) => {
            this.jumping = keyState;
        });
    }

    t_drawGhost() {
        R.ctx.save();
        R.ctx.globalAlpha = 0.4;
        //this.animations.animate(RemotePlayer.sprite, this.serverState.teamName, 16, 16);
        SpriteSheet.beginChanges();
        if (this.serverState.movementState.direction === "left") {
            RemotePlayer.sprite.flipX();
        }
        RemotePlayer.sprite.drawAnimated(
            Math.round(this.serverState.pos.x) + R.camera.displayPos.x,
            Math.round(this.serverState.pos.y) + R.camera.displayPos.y);
        SpriteSheet.end();
        R.ctx.restore();
    }

    draw() {
        super.draw();
    }

    update(deltaTime, client, currentMap) {
        super.update(deltaTime, client);
        this.currentMap = currentMap;
        this.weapon = Scene.entities.getEntityByID(this.output.invWeaponID);
        if (R.camera.config("followPlayer")) {
            R.camera.setCurrentFollowPos(this.getRealtimeProperty("centerData"));
        }

        R.camera.setConfig("followPlayer", true);
    }
}

export default UserPlayer;