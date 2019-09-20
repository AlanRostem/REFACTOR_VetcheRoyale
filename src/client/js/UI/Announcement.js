import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64 | 0, 0, 128, 18);
        this.image = AssetManager.get("ui/ui.png");
        this.elm = undefined;

        this.timer = new CTimer(0.01, () => {
            if (this.elm !== undefined)
                this.elm.x--;
        }, true);

    }

    addEvent(e) {
        this.elm = {
            event: e,
            dString: "",
            x: this.width - 10
        };
    }


    updateElm() {
        if (this.elm !== undefined) {
            this.start = this.elm.x <= 0 ? -this.elm.x / 5 | 0 : 0;
            this.elm.dString = this.elm.event.arg.string.substring(
                this.start,
                (this.width - this.elm.x - 5) / 5 | 0);
            if (this.elm.x + this.elm.event.arg.string.length * 5 - 1 <= 0)
                delete this.elm;
        }
    }

    /*
        showAnnouncement() {
            if (this.pos.y < 0) {
                this.pos.y++;
            }
        }

        hideAnnouncement() {
            if (this.pos.y >= -this.height - 4) {
                this.pos.y--;
            }
        }
     */

    update(deltaTime, client, entityList) {
        this.pos.x = R.WIDTH / 2 - 64 | 0;
        this.updateElm();
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

            if (this.elm !== undefined) {
                R.drawText(
                    this.elm.dString,
                    this.pos.x + this.elm.x + this.start * 5 + 1,
                    this.pos.y + 11, this.elm.event.arg.color
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
