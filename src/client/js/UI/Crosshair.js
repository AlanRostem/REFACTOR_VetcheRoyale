import R from "../Graphics/Renderer.js"
import Vector2D from "../../../shared/code/Math/CVector2D.js"
import UIElement from "./UIElement.js"

export default class CrossHair extends UIElement {
    constructor(id = "crosshair") {
        super(id, 0, 0, 1, 1);
        this.gap = 1;
        this.color = "#38C817";
        this.hasWeapon = false;
    }

    update(deltaTime, client, entityList) {
        this.pos.x = client.input.mouse.x;
        this.pos.y = client.input.mouse.y;
        if (client.player) {
            let weapon = entityList.getEntityByID(client.player.getRealtimeProperty("invWeaponID"));
            if (weapon) {
                this.hasWeapon = true;
                //this.gap = Math.floor(weapon.getRealtimeProperty("spreadAngle") * 25);
                this.Wid = weapon.iconID;
            }
            else {this.hasWeapon = false}
        }
    }

    draw() {
        R.ctx.save();


        if(!this.hasWeapon) {
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
        }

        else {
            R.drawCroppedImage(AssetManager.getMapImage("crossHairs"),
                15 * this.Wid, 0, 15, 15,
                this.pos.x - 8, this.pos.y - 8, 15, 15, false);

            R.ctx.restore();
        }
    }
}