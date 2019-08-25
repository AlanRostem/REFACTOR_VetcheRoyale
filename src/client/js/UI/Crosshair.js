import R from "../Graphics/Renderer.js"
import Vector2D from "../../../shared/code/Math/CVector2D.js"
import UIElement from "./UIElement.js"

export default class CrossHair extends UIElement {
    constructor(id = "crosshair") {
        super(id, 0, 0, 1, 1);
        this.gap = 5;
        this.color = "lime";
    }

    update(client, entityList) {
        this.pos.x = client.input.mouse.x;
        this.pos.y = client.input.mouse.y;
        let weapon = entityList.getEntityByID(client.player.getRealtimeProperty("_invWeaponID"));
        if (weapon) {
            this.gap = Math.floor(weapon.getRealtimeProperty("_spreadAngle") * 50);
            console.log(this.gap, weapon.getRealtimeProperty("_spreadAngle"))
        }
    }

    draw() {
        R.ctx.save();

        var gap = this.gap;

        for (var y = -1; y < 2; y += 2) {
            for (var x = -1; x < 2; x += 2) {
                var xx = (this.pos.x + x * (gap | 0)) | 0;
                var yy = (this.pos.y + y * (gap | 0)) | 0;
                //R.ctx.fillRect(xx, yy, 1,  1);

                R.drawRect(this.color, xx - x, yy, 1, 1);
                R.drawRect(this.color, xx, yy - y, 1, 1);
            }
        }
        R.drawRect(this.color, this.pos.x, this.pos.y, 1, 1);

        R.ctx.restore();
    }
}