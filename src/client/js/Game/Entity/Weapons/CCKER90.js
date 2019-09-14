import CWeapon from "./CWeapon.js";
import {vectorLinearInterpolation} from "../../../../../shared/code/Math/CCustomMath.js";
import R from "../../../Graphics/Renderer.js";

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
                let to = {x: -500*client.input.mouse.cosCenter, y: -500*client.input.mouse.sinCenter};
                this.toLerp = vectorLinearInterpolation(this.toLerp,
                    vectorLinearInterpolation(from, to, .2), .2);
            }
        } else {
            let to = {x: 0, y: 0};
            this.toLerp = vectorLinearInterpolation(this.toLerp,
                vectorLinearInterpolation(this.toLerp, to, .2), .2);
        }
        R.camera.shift(this.toLerp.x, this.toLerp.y);
        let found = this.getRealtimeProperty("found");
        if (found) console.log(found)

    }

    draw() {
        super.draw();
    }

}

export default CCKER90;