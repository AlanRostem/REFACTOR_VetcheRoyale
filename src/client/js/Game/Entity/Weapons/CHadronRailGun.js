import CWeapon from "./CWeapon.js";
import CTimer from "../../../../../shared/code/Tools/CTimer.js";

class CHadronRailGun extends CWeapon {

    firing = false;
    laserTimer = new CTimer(.05, this.countDownCallback.bind(this), true);

    constructor(d) {
        super(d, 4)
    }

    onFire(client, deltaTime) {
        this.firing = true;
        this.laserPower = 1;
        this.laserThickness = 4;
    }

    countDownCallback() {
        this.laserPower += 2;
        this.laserThickness = 5 / this.laserPower | 0;
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        this.laserTimer.tick(deltaTime);
    }

    draw() {
        super.draw();
        if (this.output.equippedToPlayer) {
            if (this.output.id === Scene.clientRef.player.output.invWeaponID) {
                let amount = 10 - (this.output.chargePercent / 10 | 0);
                let color = "White";
                R.drawRect(color, Scene.clientRef.input.mouse.x, Scene.clientRef.input.mouse.y -
                    amount, 1, 1);
                R.drawRect(color, Scene.clientRef.input.mouse.x, Scene.clientRef.input.mouse.y +
                    amount, 1, 1);
                R.drawRect(color, Scene.clientRef.input.mouse.x -
                    amount, Scene.clientRef.input.mouse.y, 1, 1);
                R.drawRect(color, Scene.clientRef.input.mouse.x +
                    amount, Scene.clientRef.input.mouse.y, 1, 1);
            }
        }
        if (this.laserPower < 20 && this.laserPower !== 0 && this.laserThickness > 0 && this.output.scanHitPos !== null) {
            R.drawLine(this.center.x, this.center.y, this.output.scanHitPos.x, this.output.scanHitPos.y,
                "Purple", this.laserThickness, true, this.laserPower);
        }
    }

}

export default CHadronRailGun;