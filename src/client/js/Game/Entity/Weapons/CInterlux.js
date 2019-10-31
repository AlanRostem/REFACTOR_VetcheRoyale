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
        if (this.player) 
        for (var i = 0; i <= this.lines.length - 2; i += 2) {
            if(i===0) R.drawLine(this.player.output.centerData.x, this.player.output.centerData.y, this.lines[i+1].x, this.lines[i+1].y, "Red", 2, true);
            //  if (this.lines)
         /*   R.ctx.beginPath();
            R.ctx.strokeStyle = "Red";
            R.ctx.moveTo(this.lines[i].x + R.camera.x, this.lines[i].y + R.camera.y);
            R.ctx.lineTo(this.lines[i + 1].x + R.camera.x, this.lines[i + 1].y + R.camera.y);
            R.ctx.stroke();*/

        }
        R.ctx.restore();
    }

}