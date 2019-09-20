import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64 | 0, 0, 128, 18);
        this.image = AssetManager.get("ui/ui.png");
        this.event = undefined;

        this.timer = new CTimer(0.01, () => {
            if (this.event !== undefined)
                this.event.x--;
        }, true);
    }

    addEvent(e) {
        if (e !== undefined) {
            this.event = {
                event: e,
                dString: "",
                x: this.width - 10
            };
            e.shown = true;
        }
    }


    updateEvent() {
        if (this.event !== undefined) {
            this.start = this.event.x <= 0 ? -this.event.x / 5 | 0 : 0;
            this.event.dString = this.event.event.arg.string.substring(
                this.start,
                (this.width - this.event.x - 5) / 5 | 0);
            if (this.event.x + this.event.event.arg.string.length * 5 - 1 <= 0)
                delete this.event;
        }
    }

    animation() {
        if (this.event !== undefined){
            if (this.pos.y < 0)
                this.pos.y++;
        }else {
            if (this.pos.y >= -this.height - 4) {
                this.pos.y--;
            }
        }
    }

    update(deltaTime, client, entityList) {
        this.pos.x = R.WIDTH / 2 - 64 | 0;
        this.animation();
        this.updateEvent();
        this.timer.tick(deltaTime);
    }

    draw() {
        if (this.pos.y > -this.height - 4) {
            R.ctx.drawImage(
                this.image,
                0, 110,
                118, 14,
                this.pos.x,
                this.pos.y + 6,
                this.width - 10,
                this.height - 4
            );

            if (this.event !== undefined) {
                R.drawText(
                    this.event.dString,
                    this.pos.x + this.event.x + this.start * 5 + 1,
                    this.pos.y + 11, this.event.event.color
                );
            }

            R.ctx.drawImage(
                this.image,
                0, 88,
                128, 22,
                this.pos.x - 5,
                this.pos.y,
                this.width,
                this.height + 4
            );
        }
    }
}
