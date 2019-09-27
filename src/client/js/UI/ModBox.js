import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

export default class ModBox extends UIElement {
    constructor() {
        super("modbox", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/ui.png");

        this.frame = new Vector2D(16, 16);
        this.backGround = new Vector2D(12, 12);

        this.hasWeapon = false;
        this.canUseMod = false;
        this.onCoolDown = false;

        this.modPercent = 0;

    }

    update(deltaTime, client, entityList) {
        if (client.player) {
            let gun = entityList.getEntityByID(client.player.output.invWeaponID);
            gun ? this.hasWeapon = true : this.hasWeapon = false;
            gun ? this.canUseMod = gun.output.canUseMod : this.canUseMod = false;
            gun ? this.modPercent = 100 - ((gun.output.modAbility.currentCoolDown / gun.output.modAbility.maxCoolDown) * 100) | 0 : 0;
                gun ? this.onCoolDown = gun.output.modAbility.onCoolDown : 0;
        }
    }

    draw() {
        if (this.hasWeapon) {
            R.ctx.save();
            R.ctx.drawImage(this.src,
                0,
                68,
                this.frame.x,
                this.frame.y,
                R.WIDTH - 110,
                R.HEIGHT - 36 + this.frame.y,
                this.frame.x,
                this.frame.y,
            );

            R.ctx.drawImage(this.src,
                this.frame.x,
                68,
                this.backGround.x,
                this.backGround.y,
                R.WIDTH - 108,
                R.HEIGHT - 30 + this.backGround.y,
                this.backGround.x,
                this.backGround.y,
            );

            if (this.onCoolDown)
                R.ctx.drawImage(this.src,
                    this.frame.x + this.backGround.x,
                    68,
                    this.backGround.x,
                    this.backGround.y * this.modPercent / 100 | 0,
                    R.WIDTH - 108,
                    R.HEIGHT - 6 - ((this.backGround.y * this.modPercent / 100) | 0),
                    this.backGround.x,
                    this.backGround.y * this.modPercent / 100 | 0,
                );

            if(this.canUseMod) R.drawRect("White", R.WIDTH - 108, R.HEIGHT - 18, 12, 12)

            R.ctx.drawImage(this.src,
                56,
                76,
                8,
                8,
                R.WIDTH - 106,
                R.HEIGHT -16,
                8,
                8,
            );

            R.ctx.restore();
        }
    }

}
