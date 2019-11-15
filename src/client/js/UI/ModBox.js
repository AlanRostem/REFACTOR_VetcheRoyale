import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class ModBox extends UIElement {
    constructor() {
        super("modbox", 0, 0, 32, 32);

        AssetManager.addSpriteCreationCallback(() => {
            this.modBoxFrame = AssetManager.getMapImage("modBoxFrame");
            this.modBoxBackground = AssetManager.getMapImage("modBoxBackground");
            this.modBoxCoolDown = AssetManager.getMapImage("modBoxCoolDown");
            this.modIcons = AssetManager.getMapImage("modIcons");
        });

        this.hasWeapon = false;
        this.canUseMod = false;
        this.onCoolDown = false;
        this.modActive = false;

        this.modPercent = 0;
        this.durationPercent = 0;

        this.iconID = 0;

    }

    update(deltaTime, client, entityList) {
        if (client.player) {
            let gun = entityList.getEntityByID(client.player.output.invWeaponID);

            this.hasWeapon = false;
            if (gun) {
                this.hasWeapon = true;

                this.canUseMod = gun.output.canUseMod;

                this.modPercent = 100 -
                    ((gun.output.modAbilityData.currentCoolDown / gun.output.modAbilityData.maxCoolDown) * 100) | 0;

                this.onCoolDown = gun.output.modAbilityData.onCoolDown;

                this.durationPercent = (1 / this.modBoxBackground.width * 100) +
                    ((gun.output.modAbilityData.currentDuration / gun.output.modAbilityData.maxDuration) * 100) | 0;

                this.modActive = gun.output.modAbilityData.active;

                this.iconID = gun.iconID;
            }
        }
    }

    draw() {
        if (this.hasWeapon) {
            R.ctx.save();

            // Mod Background
            R.drawCroppedImage(
                this.modBoxBackground,
                0,
                0,
                this.modBoxBackground.width,
                this.modBoxBackground.height,
                R.WIDTH - 108,
                R.HEIGHT - 30 + this.modBoxBackground.width,
                this.modBoxBackground.width,
                this.modBoxBackground.height);


            // Foreground when on Cool Down
            if (this.onCoolDown)
                R.drawCroppedImage(
                    this.modBoxCoolDown,
                    0,
                    0,
                    this.modBoxCoolDown.width,
                    this.modBoxCoolDown.width * this.modPercent / 100 | 0,
                    R.WIDTH - 108,
                    R.HEIGHT - 6 - ((this.modBoxCoolDown.height * this.modPercent / 100) | 0),
                    this.modBoxCoolDown.width,
                    this.modBoxCoolDown.height * this.modPercent / 100 | 0);

            // Foreground when ready to use mod
            if (this.canUseMod && !this.modActive)
                R.drawRect("#FFFFFF",
                    R.WIDTH - 108,
                    R.HEIGHT - 18,
                    this.modBoxBackground.width,
                    this.modBoxBackground.height);


            // When the mod is active(duration)
            if (this.modActive)
                R.drawRect("#FFFFFF",
                    R.WIDTH - 108,
                    R.HEIGHT - 6 - ((this.modBoxBackground.width * this.durationPercent / 100) | 0),
                    this.modBoxBackground.width,
                    this.modBoxBackground.height * this.durationPercent / 100 | 0);


            // Weapon Icon
            R.drawCroppedImage(
                this.modIcons,
                this.iconID * 8,
                0,
               8,
               8,
                R.WIDTH - 106,
                R.HEIGHT - 16,
                8,
                8);

            // Frame around modbox
            R.drawCroppedImage(
                this.modBoxFrame,
                0,
                0,
                this.modBoxFrame.width,
                this.modBoxFrame.height,
                R.WIDTH - 110,
                R.HEIGHT - 36 + this.modBoxFrame.height,
                this.modBoxFrame.width,
                this.modBoxFrame.height);

            R.ctx.restore();
        }
    }
}
