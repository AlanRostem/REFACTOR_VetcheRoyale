import CWeapon from "../CWeapon.js";
import {vectorLinearInterpolation} from "../../../../../../shared/code/Math/CCustomMath.js";
import R from "../../../../Graphics/Renderer.js";
import UI from "../../../../UI/UI.js";
import Vector2D from "../../../../../../shared/code/Math/CVector2D.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import CTimer from "../../../../../../shared/code/Tools/CTimer.js";

class CCKER90 extends CWeapon {
    constructor(props) {
        super(props, 0);
        this.toLerp = {
            x: 0,
            y: 0,
        };
        this.maxDist = 1000;
        this.pinger = new CTimer(2, () => {
            AudioPool.play("Weapons/cker90_mod.oggSE");
        });
    }

    onDrop(client, deltaTime) {
        super.onDrop(client, deltaTime);
        this.toLerp.x = 0;
        this.toLerp.y = 0;
    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);
        AudioPool.play("Weapons/cker90_shoot.oggSE", this.output.pos);
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        if (this.getRealtimeProperty("playerID") !== client.id) return;
        let isScoping = this.getRealtimeProperty("dataIsScoping");
        if (isScoping) {
            this.pinger.tick(deltaTime);
            if (client.input.getMouse(3) || client.input.getLocalKey(87)) {
                let from = {x: 0, y: 0};
                let center = {x: R.screenSize.x / 2, y: R.screenSize.y / 2};
                let d = Vector2D.distance(client.input.mouse, center);
                d *= 6;
                if (d >= this.maxDist) d = this.maxDist;
                let to = {x: -d * client.input.mouse.cosCenter, y: -d * client.input.mouse.sinCenter};
                this.toLerp = vectorLinearInterpolation(this.toLerp,
                    vectorLinearInterpolation(from, to, .2), .2);
                UI.getElement("enemyDetector").showCentralPoint();
                UI.getElement("enemyDetector").queryPositions(this.getRealtimeProperty("found"));
            }
        } else {
            let to = {x: 0, y: 0};
            this.toLerp = vectorLinearInterpolation(this.toLerp,
                vectorLinearInterpolation(this.toLerp, to, .2), .2);
        }
        R.camera.shift(this.toLerp.x, this.toLerp.y);
    }
}

export default CCKER90;