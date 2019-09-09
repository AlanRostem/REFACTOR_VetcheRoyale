import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";

export default class KelvinBar extends UIElement {
    constructor() {
        super("kelvinbar", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/KelvinBar.png");

        this.color = "Cyan";

        this.fullImage = AssetManager.get("ui/KelvinBar.png");

        this.glassTube = new Vector2D(22, 64);
        this.liquidFill = new Vector2D(4, 40);
        this.liquidTop = new Vector2D(4, 4);
        this.liquidTopCut = new Vector2D(0, 0);

        this.charge = 0;

        this.equippedGunID = -1;
        this.hasWeapon = false;

        this.animation = new SpriteSheet.Animation(0, 4, 5, 0.15);

        UIElement.defaultSpriteSheet.bind("liquidTop", 26, 128, 4, 8);
    }

    update(deltaTime, client, entityList) {

        if (client.player) {
            var gun = entityList.getEntityByID(client.player.output.invWeaponID);
            if (gun) {
                this.charge = gun.output.superChargeData;

                if (this.charge > 18) {
                    this.liquidTop.x = 4;
                    this.liquidTop.y = 8;
                    this.liquidTopCut.x = 0;
                    this.liquidTopCut.y = 4;

                } else {
                    this.liquidTop.x = 4;
                    this.liquidTop.y = 4;
                    this.liquidTopCut.x = 0;
                    this.liquidTopCut.y = 0;
                }
                this.hasWeapon = true;
            } else {
                this.charge = 0;
                this.hasWeapon = false;
            }

            //this.hasWeapon = !(ClientEntity.getEntity(this.equippedGunID) === undefined || !ClientEntity.getEntity(this.equippedGunID).boundToPlayer);


            /*
                    this.pos.x = R.WIDTH - 33;
                    if (client.keys) {
                        if (client.keys[77]) {
                            if (!client.onePressKeys[77]) {
                                this.toggle = !this.toggle;
                                client.activateOnePressKey(77);
                            }
                        } else {
                            client.resetOnePressKey(77);
                        }
                    }
                    this.updateEvent();*/

        }
    }

    draw() {
        //console.warn("meh");
        //var gun = ClientEntity.getEntity(this.equippedGunID);
        if(this.hasWeapon) {

        R.ctx.save();

        var diff = this.liquidFill.y * this.charge / 100 | 0;

        // Draw Glass Tube
        R.ctx.drawImage(this.src, 0, 0, this.glassTube.x, this.glassTube.y, R.WIDTH - this.glassTube.x - 4 | 0, R.HEIGHT - this.glassTube.y - 4 | 0, this.glassTube.x, this.glassTube.y);

        if (diff === 0) {
            return; // TODO: Remove this. I added this so the FireFox bug doesn't happen.
        }

        // Liquid Inside
        R.ctx.drawImage(this.src,
            this.glassTube.x,
            this.liquidFill.y - diff,
            this.liquidFill.x, // TODO: Cannot be 0 cus of FireFox
            diff,              // TODO: Cannot be 0 cus of FireFox
            R.WIDTH - this.glassTube.x / 2 - this.liquidFill.x / 2 - 4 | 0,
            R.HEIGHT - 6 - diff,
            4,
            diff);
        // Liquid Top
            UIElement.defaultSpriteSheet.animate("liquidTop", this.animation, 4, 8);
            UIElement.defaultSpriteSheet.drawAnimated(
                R.WIDTH - this.glassTube.x / 2 - this.liquidTop.x / 2 - 4 | 0,
                R.HEIGHT - 9 - diff,
                this.liquidTop.x,
                this.liquidTop.y);
       // R.ctx.drawImage(this.src, this.glassTube.x + this.liquidFill.x + this.liquidTopCut.x, this.liquidTopCut.y, this.liquidTop.x, this.liquidTop.y, R.WIDTH - this.glassTube.x / 2 - this.liquidTop.x / 2 - 4 | 0, R.HEIGHT - 9 - diff, this.liquidTop.x, this.liquidTop.y);
        R.ctx.restore();
        }
    }

}
