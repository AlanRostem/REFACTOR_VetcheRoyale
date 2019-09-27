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
        this.modActive = false;

        this.modPercent = 0;
        this.durationPercent = 0;

    }

    update(deltaTime, client, entityList) {
        if (client.player) {
            let gun = entityList.getEntityByID(client.player.output.invWeaponID);

            this.hasWeapon = false;
            if(gun) {
                this.hasWeapon = true;

                this.canUseMod = gun.output.canUseMod;

                this.modPercent = 100 -
                    ((gun.output.modAbility.currentCoolDown / gun.output.modAbility.maxCoolDown) * 100) | 0;

                this.onCoolDown = gun.output.modAbility.onCoolDown;

                this.durationPercent = (1 / this.backGround.y * 100) +
                    ((gun.output.modAbility.currentDuration / gun.output.modAbility.maxDuration) * 100) | 0;

                this.modActive = gun.output.modAbility.active;
            }
        }
    }

    draw() {
        if (this.hasWeapon) {
            R.ctx.save();

            // ModBox dark background
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

            // Foreground when on Cool Down
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

            // Foreground when ready to use mod
            if(this.canUseMod && !this.modActive)
                R.drawRect("White",
                    R.WIDTH - 108,
                    R.HEIGHT - 18,
                    this.backGround.x,
                    this.backGround.y);


            // When the mod is active(duration)
            if(this.modActive)
                R.drawRect("White",
                    R.WIDTH - 108,
                    R.HEIGHT - 6 - ((this.backGround.y * this.durationPercent / 100) | 0),
                     this.backGround.x,
                    this.backGround.y * this.durationPercent / 100 | 0);

            // Weapon Icon
            R.ctx.drawImage(this.src,
                40,
                76,
                8,
                8,
                R.WIDTH - 106,
                R.HEIGHT -16,
                8,
                8,
            );

            // Frame around modbox
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

            R.ctx.restore();
        }
    }
}
