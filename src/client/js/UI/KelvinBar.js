try {
    Gun = require("../Items/Guns/Gun");
} catch (e) {}

class KelvinBar extends UIElement {
    constructor() {
        super("kelvinbar", R.WIDTH - 33, 1, 1, 1);
        this.color = "Cyan";

        this.equippedGunID = -1;

        this.hasWeapon = false;

        try {

            //     this.sprite = new SpriteSheet("Client/assets/img/ui/ui.png");

            // Strink
            this.strink = new Image();
            this.strink.src = "Client/assets/img/ui/strink.png";

        } catch (e) {
        }
    }

    update(client) {


        this.hasWeapon = !(ClientEntity.getEntity(this.equippedGunID) === undefined || !ClientEntity.getEntity(this.equippedGunID).boundToPlayer);


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
        var gun = ClientEntity.getEntity(this.equippedGunID);

        R.ctx.save();
        if (this.hasWeapon &&  ClientEntity.getEntity(this.equippedGunID) !== undefined) {
            console.log(true);
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
        R.ctx.drawImage(this.strink, R.WIDTH - this.strink.width - 8, R.HEIGHT - this.strink.height - 4);
        R.ctx.restore();
    }

}
