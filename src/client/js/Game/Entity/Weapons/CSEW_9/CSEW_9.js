import CWeapon from "../CWeapon.js";
import R from "../../../../Graphics/Renderer.js";
import {vectorLinearInterpolation} from "../../../../../../shared/code/Math/CCustomMath.js";
import UI from "../../../../UI/UI.js";
import Scene from "../../../Scene.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";

export default class CSEW_9 extends CWeapon {

    constructor(data) {
        super(data, 1);
        this.isShooting = false;
        this.missileSound = null;
    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        this.missileSound = AudioPool.play("Weapons/sew-9_a.oggSE")
    }

    onReloadAction(client, deltaTime) {
        super.onReloadAction(client, deltaTime);
        this.reloadSnd = AudioPool.play("Weapons/sew-9_reload.oggSE");
    }

    onDrop(client, deltaTime) {
        super.onDrop(client, deltaTime);
        if(this.reloadSnd) this.reloadSnd.stop();
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);
        this.isShooting = this.getRealtimeProperty("isShooting");
        if (this.missileSound) {
            this.missileSound.updatePanPos(this.output.misPos);
            if (!this.isShooting) {
                this.missileSound.stop();
                this.missileSound = null;
            }
        }

        if (this.output.modAbilityData.active) {
            if (!this.missileSound) {
                this.missileSound = AudioPool.play("Weapons/sew-9_a.oggSE")
            }
        } else if (this.missileSound && !this.isShooting) {
            this.missileSound.stop();
            this.missileSound = null;
        }


    }

    draw() {
        super.draw();

        let superAbility = this.getRealtimeProperty("superAbilitySnap");
        let player = this.player;
        if (!player) return;
        let right = (player.movementState.direction === "right") ? 1 : -1;
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


function lightningToPlayer(px, py, mx, my) {

    console.log(mx, px, my, py);

    if (mx === px && my === py) return;

    px += (mx !== px && mx > px) ? ((Math.random() * 2 | 0)) : (Math.random() * 2 | 0) * -1;
    py += (my !== py && my > py) ? ((Math.random() * 2 | 0)) : (Math.random() * 2 | 0) * -1;

    R.drawRect("White", px, py, 1, 1, true);

    lightningToPlayer(px, py, mx, my);
    /*if (length-- > 0) {

        R.drawRect("White", x, y, 1, 1, true);
        R.drawRect("Cyan", x + right, y, 1, 1, true);

        let nx = x + (Math.random() * 2 | 0) * right;
        let ny = y + (yVal ? 0 : ((Math.random() * 2 | 0)) * ((Math.random() * 2 | 0) ? 1 : -1));
        lightning(nx, ny, length, life ? 0 : ny - y, life ? --life : 2, right);
    }*/
}