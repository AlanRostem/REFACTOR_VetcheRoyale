import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64 | 0, 0, 128, 18);
        this._image = AssetManager.get("ui/ui.png");
        this._elm = undefined;
        //this._queue = [];
        /*
        this._timer = new CTimer(0.01, () => {
           // if (this._elm !== undefined)
            // this._elm._x--;
        }, true);
        */

        this._timer = new CTimer(4, () => {
            this._elm = undefined;
        }, true);
    }


    set elm(evt) {
        this._elm = evt;
        console.log(this._elm);
    }

    /*
    add(string, color = "Red") {
        this._queue.push({
            _dString: "",
            _string: string,
            _color: color,
            _x: this.width - 10
        });
    }


    updateQueue() {
        if (this._queue.length !== 0 && this._elm === undefined)
            this._elm = this._queue.shift();
    }

    updateElm() {
        if (this._elm !== undefined) {
            this.start = this._elm._x <= 0 ? -this._elm._x / 5 | 0 : 0;
            this._elm._dString = this._elm._string.substring(
                this.start,
                (this.width - this._elm._x - 5) / 5 | 0);

            if (this._elm._x + this._elm._string.length * 5 - 1 <= 0)
                delete this._elm;
        }
    }

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
        this._timer.tick(deltaTime);

    }

    draw() {
        if (this.pos.y > -this.height - 4) {
            R.ctx.drawImage(
                this._image,
                0, 110,
                118, 14,
                this.pos.x,
                this.pos.y + 6,
                this.width - 10,
                this.height - 4
            );
            /*
                        if (this._elm !== undefined) {
                            R.drawText(
                                this._elm._dString,
                                this.pos.x + this._elm._x + this.start * 5 + 1,
                                this.pos.y + 11, this._elm._color
                            );
                        }
            */
            R.ctx.drawImage(
                this._image,
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