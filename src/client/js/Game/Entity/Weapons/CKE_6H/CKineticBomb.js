import CEntity from "../../CEntity.js";
import CWeapon from "../CWeapon.js";
import R from "../../../../Graphics/Renderer.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";

let explSpeed = 0.05;

class CKineticBomb extends CEntity {

    onClientSpawn(dataPack, client) {
        super.onClientSpawn(dataPack, client);
        AudioPool.play("Weapons/ke-6h_s.oggSE")
            .updatePanPos(this.output.pos);
    }

    onClientDelete(client) {
        super.onClientDelete(client);
        EffectManager.createEffect(this.output.pos.x - 12, this.output.pos.y - 12, "kineticBombExpl", 0);
        AudioPool.play("Weapons/explo1.oggSE")
            .updatePanPos(this.output.pos);
    }

    draw() {

        R.drawCroppedImage(
            AssetManager.getMapImage("KE-6H_bullet"),
            0,
            0,
            5,
            5,
            this.output.pos.x + R.camera.x,
            this.output.pos.y + R.camera.y,
            5,
            5
        );
    }
}

EffectManager.configureEffect("kineticBombExpl", 0, 0, 24, 24, 6, explSpeed);

export default CKineticBomb;