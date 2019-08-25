import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64, 4, 128, 16);
        this._color = "Red";
        this._queue = [];
        this.element = undefined;

        this._timer = new CTimer(0.03, () => {
            if (this.element !== undefined)
                this.element._x--;

        }, true);

        this.add("test", "Blue");
        this.add("test2", "Blue");
        this.addPriority("Removing elements from a JavaScript array is a common programming paradigm that developers often run into. As with a lot of things JavaScript, this isn’t as simple as it probably should be.", "Blue");
    }


    addPriority(string, color) {
        this._queue.unshift({
            _string: string,
            _color: color,
            _x: this.pos.x + this.width
        });
    }


    add(string, color) {
        this._queue.push({
            _string: string,
            _color: color,
            _x: this.pos.x + this.width
        });
    }


    updateQueue() {
        if (this._queue.length !== 0 && this.element === undefined)
            this.element = this._queue.shift();
    }


    update(deltaTime, client, entityList) {
        this.updateQueue();
        this._timer.tick(deltaTime);
    }

    draw() {

        if (this.element !== undefined) {
            R.drawText(this.element._string, this.element._x, this.pos.y + 5, this.element._color);
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