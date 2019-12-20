import CWeapon from "../CWeapon.js";
import CTimer from "../../../../../../shared/code/Tools/CTimer.js";
import R from "../../../../Graphics/Renderer.js";

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
            hadronParticleEffect(this.center.x, this.center.y, this.output.scanHitPos.x, this.output.scanHitPos.y,
                this.laserThickness + (this.output.chargePercent * 10 | 0), this.laserPower
            );
        }
    }
}

export function hadronParticleEffect(x0, y0, x1, y1, thickness, space) {

    let counter = 1;
    let drawPixel = true;

    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);

    y1 = Math.round(y1);
    /*var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = (dx > dy ? dx : -dy) / 2;*/

    let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    let dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    while (true) {

        let dim = thickness / 2 | 0;
        R.context.fillStyle = "Red";
        R.context.fillRect(
            Math.round(x0 + (Math.random() * 3 + 1 | 0) + R.camera.x) - dim,
            Math.round(y0 + (Math.random() * 3 + 1 | 0) + R.camera.y) - dim, thickness, thickness);

        R.context.fillStyle = "darkblue";
        R.context.fillRect(
            Math.round(x0 + (Math.random() * 3 + 1 | 0) + R.camera.x) - dim,
            Math.round(y0 + (Math.random() * 3 + 1 | 0) + R.camera.y) - dim, thickness, thickness);

        if (x0 === x1 && y0 === y1) break;

        let e2 = err;
        if (e2 > -dx) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dy) {
            err += dx;
            y0 += sy;
        }
    }
}

export default CHadronRailGun;