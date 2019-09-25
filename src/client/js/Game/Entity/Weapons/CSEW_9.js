import CWeapon from "./CWeapon.js";
import R from "../../../Graphics/Renderer.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import UI from "../../../UI/UI.js";

export default class CSEW_9 extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
    }


    update(deltaTime, client) {
        super.update(deltaTime, client);
        console.log(true);
        if (this.getRealtimeProperty("playerID") !== client.id) return;
        let secondary = this.getRealtimeProperty("secondaryFire");
        if (secondary) {
            if (client.input.getMouse(3)) {
               /* let from = {x: 0, y: 0};
                let to = {x: -500 * client.input.mouse.cosCenter, y: -500 * client.input.mouse.sinCenter};
                this.toLerp = vectorLinearInterpolation(this.toLerp,
                    vectorLinearInterpolation(from, to, .2), .2);*/
                R.camera.shift(this.output.misPos.x, this.output.misPos.y);
            }
        } else {
            let to = {x: 0, y: 0};
            this.toLerp = vectorLinearInterpolation(this.toLerp,
                vectorLinearInterpolation(this.toLerp, to, .2), .2);
            R.camera.shift(this.toLerp.x, this.toLerp.y);
        }
    }
}
