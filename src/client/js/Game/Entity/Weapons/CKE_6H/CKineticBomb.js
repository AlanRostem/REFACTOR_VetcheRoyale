import CEntity from "../../CEntity.js";
import CWeapon from "../CWeapon.js";
import R from "../../../../Graphics/Renderer.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import SoundManager from "../../../../AssetManager/Classes/Audio/SoundManager.js";

let explSpeed = 0.05;

class CKineticBomb extends CEntity {

    onClientSpawn(dataPack, client) {
        super.onClientSpawn(dataPack, client);
        SoundManager.play("Weapons/ke-6h_s.oggSE");
    }

    onClientDelete(client) {
        super.onClientDelete(client);
        EffectManager.createEffect(this.output.pos.x - 12, this.output.pos.y - 12, "kineticBombExpl", 0);
        SoundManager.play("Weapons/explo" + (Math.random() * 4 | 0) + ".oggSE")
    }

    draw() {
        CWeapon.sprite.drawStill("kineticBomb",
            this.output.pos.x + R.camera.x - 4,
            this.output.pos.y + R.camera.y - 4)
    }
}

EffectManager.configureEffect("kineticBombExpl", 0, 0, 24, 24, 6, explSpeed);
CWeapon.sprite.bind("kineticBomb", 64, 32, 8, 8);

export default CKineticBomb;