import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";

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

        this.pr = 0;
        this.mpr = 0;


        this.equippedGunID = -1;
        this.hasWeapon = false;
    }

    update(client) {

        if (this.mpr++ > 10 && (this.mpr = 0 === 0) && this.pr++ === 100) this.pr = this.mpr = 0;

        if (this.pr > 18) {
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

    draw() {
        //console.warn("meh");
        //var gun = ClientEntity.getEntity(this.equippedGunID);

        R.ctx.save();
        if (this.hasWeapon) {
            var gun = ClientEntity.getEntity(this.equippedGunID);
            if (ClientEntity.getEntity(this.equippedGunID) !== undefined) {
                R.ctx.fillStyle = "cyan";
                R.ctx.fillRect(R.WIDTH - this.strink.width + 5, R.HEIGHT - this.strink.height + 15 - (48 * (gun.superCharge / 100)), 5, 48 * (gun.superCharge / 100));
                if (gun.superCharge === 100) {
                    R.ctx.globalAlpha = 1;
                    R.ctx.beginPath();
                    R.ctx.arc(R.WIDTH - this.strink.width + 38 + 10, R.HEIGHT - this.strink.height + 40, 32, 0, Math.PI * 2);
                    R.ctx.fill();
                    R.ctx.fillStyle = "black";
                    R.ctx.font = "32px sans-serif";
                    R.ctx.fillText("Q", R.WIDTH - this.strink.width + 38 - 3, R.HEIGHT - this.strink.height + 40 + 10);
                }
                R.ctx.globalAlpha = 1;
            }
        }

        var diff = this.liquidFill.y * this.pr / 100 | 0;

        // Draw Glass Tube
        R.ctx.drawImage(this.src, 0, 0, this.glassTube.x, this.glassTube.y, R.WIDTH - this.glassTube.x - 4 | 0, R.HEIGHT - this.glassTube.y - 4 | 0, this.glassTube.x, this.glassTube.y);
        // Liquid Inside
        R.ctx.drawImage(this.src, this.glassTube.x, this.liquidFill.y - diff, this.liquidFill.x, diff, R.WIDTH - this.glassTube.x / 2 - this.liquidFill.x / 2 - 4 | 0, R.HEIGHT - 6 - diff, 4, diff);
        // Liquid Top
        R.ctx.drawImage(this.src, this.glassTube.x + this.liquidFill.x + this.liquidTopCut.x, this.liquidTopCut.y, this.liquidTop.x, this.liquidTop.y, R.WIDTH - this.glassTube.x / 2 - this.liquidTop.x / 2 - 4 | 0, R.HEIGHT - 9 - diff, this.liquidTop.x, this.liquidTop.y);
        R.ctx.restore();
    }

}
