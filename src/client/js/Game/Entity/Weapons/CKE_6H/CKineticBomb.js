import CEntity from "../../CEntity.js";
import CWeapon from "../CWeapon.js";
import R from "../../../../Graphics/Renderer.js";

class CKineticBomb extends CEntity {

    draw() {
        CWeapon.sprite.drawStill("kineticBomb",
            this.output.pos.x + R.camera.x - 4,
            this.output.pos.y + R.camera.y - 4)
    }
}

CWeapon.sprite.bind("kineticBomb", 64, 32, 8, 8);

export default CKineticBomb;