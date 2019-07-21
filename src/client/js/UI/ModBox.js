import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

export default class ModBox extends UIElement {
    constructor() {
        super("modbox", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/ui.png");

        this.frame = new Vector2D(16, 16);

        this.hasWeapon = false;

    }

    update(client, entityList) {
        if (client.player) {
            var gun = entityList.getEntityByID(client.player.output._invWeaponID);
            gun ? this.hasWeapon = true : this.hasWeapon = false;
        }
    }

    draw() {
        if(this.hasWeapon) {
            R.ctx.save();
            R.ctx.drawImage(this.src,
                0,
                68,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
                R.WIDTH - 110,
                R.HEIGHT - 36 + this.frame.y,
                this.frame.x, // TODO: Cannot be 0 cus of FireFox
                this.frame.y,  // TODO: Cannot be 0 cus of FireFox
            );
            R.ctx.restore();
        }
    }

}
