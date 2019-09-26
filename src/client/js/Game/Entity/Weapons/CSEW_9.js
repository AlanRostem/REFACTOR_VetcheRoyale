import CWeapon from "./CWeapon.js";
import R from "../../../Graphics/Renderer.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import UI from "../../../UI/UI.js";

export default class CSEW_9 extends CWeapon {
    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
    }

    update(deltaTime, client) {
        this.client = client;
        super.update(deltaTime, client);
        if (this.getRealtimeProperty("playerID") !== client.id) return;
        let secondary = this.getRealtimeProperty("secondaryFire");
        if (secondary) {
            R.camera.setConfig("followPlayer", false);
            R.camera.setCurrentFollowPos(this.output.misPos);
        } else {
            R.camera.setConfig("followPlayer", true);
        }

    }

    draw() {
        super.draw();

        let superAbility = this.getRealtimeProperty("superAbilitySnap");
        let client = this.client;
        if (superAbility) {
            lightning(client.player.output.pos.x + client.player.output.width / 2, client.player.output.pos.y + client.player.output.height / 2, 200, 0, 0);
            // lightning(client.player.output.pos.x + client.player.output.width/2, client.player.output.pos.y + client.player.output.height / 2, 200);
        }
    }
}

function lightning(x, y, length, yVal, life) {
    if (length-- > 0) {

        R.drawRect("Cyan", x, y + 1, 1, 1, true);
        R.drawRect("Cyan", x + 1, y - 1, 1, 1, true);
        R.drawRect("Cyan", x + 1, y + 1, 1, 1, true);
        R.drawRect("Cyan", x, y - 1, 1, 1, true);

        R.drawRect("White", x, y, 1, 1, true);

        let nx = x + (Math.random() * 2 | 0);
        let ny = y + (yVal ? 0 : ((Math.random() * 2 | 0)) * ((Math.random() * 2 | 0) ? 1 : -1));
        lightning(nx, ny, length, life ? 0 : ny - y, life ? --life : 2);
    }
    R.drawRect("Cyan", x + 1, y, 1, 1, true);
}

/*

function lightning(x, y, length, xVal, yLife, yVal) {
    length--;
    if (length > 0) {
        R.drawRect("Cyan", x, y, 1, 1, true);
        let nx = x + 1;
        let ny = y + yVal;
        lightning(
            nx,
            ny,
            length,
            xVal  ? 0 : Math.abs(nx - x),
            yLife > 0 ? yLife - 1 : ((Math.random() * 2 | 0) + 2),
            yLife > 0 ? 0 : (Math.random() * 2 | 0) ? 1 : -1);
    }
}
 */