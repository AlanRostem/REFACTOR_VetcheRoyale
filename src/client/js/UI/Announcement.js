import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64 | 0, 4, 128, 16);
        this._color = "Red";
        this._queue = [];
        this._elm = undefined;

        this._timer = new CTimer(0.3, () => {
            if (this._elm !== undefined)
                this._elm._x -= 5;
        }, true);

        this.add("TestTestTest", "Blue");
        this.add("TestTestTest", "Blue");
        this.addPriority("The substr() method extracts parts of a string, beginning at the character at the specified position, and returns the specified number of characters.", "Blue");
    }

    addPriority(string, color) {
        this._queue.unshift({
            _string: string,
            _color: color,
            _x: this.width
        });
    }

    add(string, color) {
        this._queue.push({
            _dString: "",
            _string: string,
            _color: color,
            _x: this.width
        });
    }

    updateQueue() {
        if (this._queue.length !== 0 && this._elm === undefined)
            this._elm = this._queue.shift();
    }

    updateElm() {
        if (this._elm !== undefined) {
            this._elm._dString = this._elm._string.substring(
                this._elm._x < 0 ? -this._elm._x / 5 | 0 : 0,
                (this.width - this._elm._x) / 5 | 0);

            if (this._elm._x + this._elm._string.length * 5 - 1 <= 0)
                delete this._elm;
        }
    }

    update(deltaTime, client, entityList) {
        this.pos.x = R.WIDTH / 2 - 64 | 0;
        this.updateQueue();
        this.updateElm();
        this._timer.tick(deltaTime);
    }

    draw() {
        if (this._elm !== undefined) {
            R.drawText(this._elm._dString, this._elm._x > 0 ? this.pos.x + this._elm._x : this.pos.x, this.pos.y + 5, this._elm._color);
        }

        R.ctx.save();
        R.ctx.strokeStyle = this._color;
        R.ctx.beginPath();
        R.ctx.rect(
            this.pos.x | 0,
            this.pos.y | 0,
            this.width,
            this.height
        );
        R.ctx.stroke();
        R.ctx.restore();
    }
}