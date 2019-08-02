import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

export default class GunBox extends UIElement {
    constructor() {
        super("gunbox", 0, 0, 32, 32);

        this.src = AssetManager.get("ui/ui.png");

        this.frame = new Vector2D(64, 32);

        this.hasWeapon = false;

        this.playerAmmo = 0;
        this.loadedAmmo = 0;

    }

    update(client, entityList) {
        if (client.player) {
            var gun = entityList.getEntityByID(client.player.output._invWeaponID);
            if (gun) {
                this.hasWeapon = true;
                this.playerAmmo = client.player.output._invAmmo;
                this.loadedAmmo = gun.output._currentAmmo;
            } else {
                this.hasWeapon = false;
            }
        }
    }

    draw() {

        if (this.hasWeapon) {
            R.ctx.save();

            R.drawText(this.loadedAmmo + "/" + this.playerAmmo, R.WIDTH - 72, R.HEIGHT - 44, "LIME", false, 7);

            R.ctx.drawImage(this.src,
                0,
                36,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
                R.WIDTH - 92,
                R.HEIGHT - 36,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
            );
            R.ctx.restore();
        }

    }

}
