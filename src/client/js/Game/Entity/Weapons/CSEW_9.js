import CWeapon from "./CWeapon.js";
import R from "../../../Graphics/Renderer.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import UI from "../../../UI/UI.js";
import Scene from "../../Scene.js";
import AudioPool from "../../../AssetManager/Classes/Audio/AudioPool.js";

export default class CSEW_9 extends CWeapon {

    constructor(data) {
        super(data, 1);
        this.isShooting = false;
    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);
        super.update(deltaTime, client);
        if (this.getRealtimeProperty("playerID") !== client.id) return;
        let secondary = this.getRealtimeProperty("secondaryFire");
        if (secondary) {
            R.camera.setConfig("followPlayer", false);
            R.camera.setCurrentFollowPos(this.output.misPos);
        } else {
            R.camera.setConfig("followPlayer", true);
        }

        this.isShooting = this.getRealtimeProperty("isShooting");

        if(this.isShooting) AudioPool.play("Weapons/sew-9_a.oggSE", this.output.misPos, this.isShooting);
        else AudioPool.stop("Weapons/sew-9_a.oggSE");

    }

    draw() {
        super.draw();

        let superAbility = this.getRealtimeProperty("superAbilitySnap");
        let player = this.player;
        if(!player) return;
        let right = (player.output.movementState.direction === "right") ? 1 : -1;
        if (superAbility) {
            lightning(player.output.pos.x + player.output.width / 2, player.output.pos.y + player.output.height / 2, 200, 0, 0, right);
        }
    }
}

function lightning(x, y, length, yVal, life, right) {

    if (length-- > 0) {

        R.drawRect("White", x, y, 1, 1, true);
        R.drawRect("Cyan", x + right, y, 1, 1, true);

        let nx = x + (Math.random() * 2 | 0) * right;
        let ny = y + (yVal ? 0 : ((Math.random() * 2 | 0)) * ((Math.random() * 2 | 0) ? 1 : -1));
        lightning(nx, ny, length, life ? 0 : ny - y, life ? --life : 2, right);
    }
}
