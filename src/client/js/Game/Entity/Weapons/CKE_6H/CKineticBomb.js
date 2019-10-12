import CEntity from "../../CEntity.js";
import CWeapon from "../CWeapon.js";
import R from "../../../../Graphics/Renderer.js";
import EffectManager from "../../../../Graphics/EffectManager.js";

let explSpeed = 0.05;

class CKineticBomb extends CEntity {

    onClientDelete(client) {
        super.onClientDelete(client);
        EffectManager.createEffect(this.output.pos.x - 12, this.output.pos.y - 12, "kineticBombExpl", 0);
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