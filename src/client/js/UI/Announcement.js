import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";
import AssetManager from "../AssetManager/AssetManager.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64 | 0, 0, 128, 18);
        this.color = "#222034";
        this.queue = [];
        this.elm = undefined;

        this.timer = new CTimer(0.01, () => {
            if (this.elm !== undefined)
                this.elm.x--;
        }, true);


        this.timer2 = new CTimer(7, () => {
            this.add("Alert!", "Red");
            this.add("Alan e en kuk ;)", "Yellow");
        }, true);

        this.image = AssetManager.get("ui/ui.png");


        //this.add(" !\"#$%&\\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\\\]^_`", "Red");
        //this.addPriority("The substr() method extracts parts of a string, beginning at the character at the specified position, and returns the specified number of characters.", "Blue");
    }

    addPriority(string, color) {
        this.queue.unshift({
            string: string,
            color: color,
            x: this.width - 10
        });
    }

    add(string, color) {
        this.queue.push({
            dString: "",
            string: string,
            color: color,
            x: this.width - 10
        });
    }

    updateQueue() {
        if (this.queue.length !== 0 && this.elm === undefined)
            this.elm = this.queue.shift();
    }

    updateElm() {
        if (this.elm !== undefined) {
            this.start = this.elm.x <= 0 ? -this.elm.x / 5 | 0 : 0;
            this.elm.dString = this.elm.string.substring(
                this.start,
                (this.width - this.elm.x - 5) / 5 | 0);

            if (this.elm.x + this.elm.string.length * 5 - 1 <= 0)
                delete this.elm;
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


    update(deltaTime, client, entityList) {
        this.pos.x = R.WIDTH / 2 - 64 | 0;
        if (this.elm !== undefined || this.queue.length !== 0)
            this.showAnnouncement();
        else if (this.queue.length === 0)
            this.hideAnnouncement();


        this.updateQueue();
        this.updateElm();
        this.timer.tick(deltaTime);
        this.timer2.tick(deltaTime);
    }

    draw() {
        if (this.pos.y > -this.height - 4) {
            R.ctx.drawImage(
                this.image,
                0,
                110,
                118,
                14,
                this.pos.x,
                this.pos.y + 6,
                this.width - 10,
                this.height - 4
            );

            if (this.elm !== undefined) {
                R.drawText(
                    this.elm.dString,
                    this.pos.x + this.elm.x + this.start * 5 + 1,
                    this.pos.y + 11, this.elm.color
                );
            }

            R.ctx.drawImage(
                this.image,
                0,
                88,
                128,
                22,
                this.pos.x - 5,
                this.pos.y,
                this.width,
                this.height + 4
            );

        }
    }
}