import CWeapon from "./CWeapon.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import R from "../../../Graphics/Renderer.js";
import UI from "../../../UI/UI.js";
import Vector2D from "../../../../../shared/code/Math/CVector2D.js";

class CCKER90 extends CWeapon {
    constructor(props) {
        super(props);
        this.toLerp = {
            x: 0,
            y: 0,
        };
        this.prevFrom = {
            x: 0,
            y: 0,
        };
    }


    update(deltaTime, client) {
        super.update(deltaTime, client);
        if (this.getRealtimeProperty("playerID") !== client.id) return;
        let isScoping = this.getRealtimeProperty("dataIsScoping");
        if (isScoping) {
            if (client.input.getMouse(3)) {
                let from = {x: 0, y: 0};
                let center = {x: R.screenSize.x / 2, y: R.screenSize.y / 2};
                let d = Vector2D.distance(client.input.mouse, center);
                d *= 6;
                let to = {x: -d * client.input.mouse.cosCenter, y: -d * client.input.mouse.sinCenter};
                this.toLerp = vectorLinearInterpolation(this.toLerp,
                    vectorLinearInterpolation(from, to, .2), .2);
                UI.getElement("enemyDetector").showCentralPoint();
            }
        } else {
            let to = {x: 0, y: 0};
            this.toLerp = vectorLinearInterpolation(this.toLerp,
                vectorLinearInterpolation(this.toLerp, to, .2), .2);
        }
        R.camera.shift(this.toLerp.x, this.toLerp.y);
        UI.getElement("enemyDetector").queryPositions(this.getRealtimeProperty("found"));
    }
}

export default CCKER90;