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
        if (this.getRealtimeProperty("playerID") !== client.id) return;
        let secondary = this.getRealtimeProperty("secondaryFire");
        let superAbility = this.getRealtimeProperty("superActive");
        if (secondary) {
                R.camera.setConfig("followPlayer", false);
                R.camera.setCurrentFollowPos(this.output.misPos);
        }
        else {
            R.camera.setConfig("followPlayer", true);
        }
        if(superAbility)
        {
            R.drawRect("Red",0,0,200,200, true);
        }
    }
}
