import CWeapon from "./CWeapon.js";
import Scene from "../../Scene.js";
import R from "../../../Graphics/Renderer.js";

export default class CInterlux extends CWeapon {

    constructor(data) {
        super(data, 3);

        this.lines = null;
    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);

    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);
        this.lines = this.getRealtimeProperty("lines");
        super.update(deltaTime, client);
    }

    draw() {
        super.draw();
        R.ctx.save();

        //console.log(this.lines);
        let r = Scene.clientRef.inboundPacket.gameData.debugData.scanBox;
        if (r)
            if (Object.keys(r).length > 0) {
                R.ctx.beginPath();
                R.ctx.strokeStyle = "Green";
                R.ctx.lineWidth = 2;
                R.ctx.rect(
                    r.sx + R.camera.x,
                    r.sy + R.camera.y,
                    -(r.sx - r.ex),
                    -(r.sy - r.ey));
                R.drawText((r.sx - r.ex) + ", " + (r.sy - r.ey), 0, 10, "White");
                R.ctx.stroke();
            }

        for (var i = 0; i <= this.lines.length - 2; i += 2) {
            R.ctx.beginPath();
            R.ctx.strokeStyle = "Red";
            R.ctx.moveTo(this.lines[i].x + R.camera.x, this.lines[i].y + R.camera.y);
            R.ctx.lineTo(this.lines[i + 1].x + R.camera.x, this.lines[i + 1].y + R.camera.y);
            R.ctx.stroke();

        }
        R.ctx.restore();

    }

}