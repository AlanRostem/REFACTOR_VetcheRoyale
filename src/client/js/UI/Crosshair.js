class Crosshair {
    constructor() {
        this.pos = new Vector2D(0, 0);
        this.mouse = new Vector2D(0, 0);
        this.gap = 0;
        this.length = 10;
        this.stroke = 2;
        var _this = this;
        this.color = "lime";
        this.angle = 0;
        this.img = new Image();
        this.img.src = "Client/assets/img/ui/chevron.svg";
        window.addEventListener("mousemove", e => {
            _this.mouse.x = e.clientX;
            _this.mouse.y = e.clientY;
        });
    }

    update(angle) {
        this.angle = angle;
    }

    reticle() {
        R.ctx.save();
        //R.ctx.scale(R.NEW_SX, R.NEW_SY);
        var gap = this.gap;
        var gun = ClientEntity.getEntity(client.inventory.equippedGunID);
        if (gun !== undefined) {
            gap += gun.accuracy * 45 * 3 / Math.PI;
        }
        R.ctx.fillStyle = this.color;

        this.pos.x = this.mouse.x * R.NEW_SX;
        this.pos.y = this.mouse.y * R.NEW_SY;
        this.pos.x |= 0;
        this.pos.y |= 0;

        for (var y = -1; y < 2; y+=2) {
            for (var x = -1; x < 2; x+=2) {
                var xx = ((this.pos.x + x * (gap | 0))) | 0;
                var yy = ((this.pos.y + y * (gap | 0))) | 0;
                //R.ctx.fillRect(xx, yy, 1,  1);

                R.ctx.fillRect(xx - x, yy, 1,  1);
                R.ctx.fillRect(xx, yy - y, 1,  1);
            }
        }
        R.ctx.fillRect(this.pos.x, this.pos.y, 1,  1);

        R.ctx.restore();
    }

    draw() {
        this.reticle();
    }
}