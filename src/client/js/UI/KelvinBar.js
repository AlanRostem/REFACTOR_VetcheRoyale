import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";

export default class KelvinBar extends UIElement {
    constructor() {
        super("kelvinbar", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/KelvinBar.png");

        this.color = "Cyan";

        this.equippedGunID = -1;
        this.hasWeapon = false;
    }

    update(client) {

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
        var pr = 80;
        R.ctx.drawImage(this.src, 22, 41 - (40 * pr / 100) | 0, 4, 40 * pr / 100 | 0, R.WIDTH - 17 | 0, R.HEIGHT - 45 + 40 - 40 * pr / 100| 0, 4, 40 * pr / 100 | 0);
        R.ctx.drawImage(this.src, 26, 0, 4, 4 , R.WIDTH - 17 | 0, R.HEIGHT - 8 - 40 * pr / 100 | 0 | 0, 4, 4);
        R.ctx.drawImage(this.src, 0, 0, 22, 62, R.WIDTH - 26 | 0, R.HEIGHT - 66 | 0, 22, 62);
        R.ctx.restore();
    }

}
