import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";

export default class Announcement extends UIElement {
    constructor() {
        super("announcement", R.WIDTH / 2 - 64, 1, 128, 16);
        this.color = "Red";
        this.annoucements = [];
        this.activeAnnoucement = 0;
    }

    static Announce = class {
        constructor(string, life) {
            this.wholeString = string;
            this.life = life;
            this.outOfscreen = false;
            this.string = "";
            this.spd = 0.5;
            this.x = 0;
            this.time = 0;
        }

        update(width) {
            this.time += Game.getDeltaTime();

            this.outOfscreen = false;
            if (this.x > width + R.ctx.measureText(this.string).width) {
                this.outOfscreen = true;
                this.life -= 1;
                this.x = 0;
                this.string = "";
            }

            if (this.time > .5) {
                this.time = 0;

                var stringSize = R.ctx.measureText(this.wholeString).width / this.wholeString.length + 1 | 0;

                this.x += stringSize;

                var iStart = (this.x - width) / stringSize | 0;
                var iEnd = (this.x) / stringSize | 0;

                this.string = this.wholeString.slice((iStart <= 0) ? 0 : iStart, iEnd);
            }
        }
    };

    addAnnouncement(string, life) {
        this.annoucements.push(new Annoucement.Annouce(string, life));
        console.log(this.annoucements);
    }

    drawAnnouncement() {
        var a = this.annoucements[this.activeAnnoucement];
        if (a !== undefined) {
            R.drawText(a.string,
                (this.pos.x + this.width) - a.x,
                (this.pos.y + 10),
                "lime"
            );
        }
    }

    update() {
        this.pos.x = R.WIDTH / 2 - 64;
        var a = this.annoucements[this.activeAnnoucement];
        if (a !== undefined) {
            a.update(this.width);
            if (a.outOfscreen === true) {
                console.log(a);
                if (a.life <= 0)
                    delete this.annoucements.splice(this.activeAnnoucement, 1);
                else
                    this.activeAnnoucement++;
            }
            if (this.activeAnnoucement >= this.annoucements.length)
                this.activeAnnoucement = 0;
        }
    }

    draw() {
        R.ctx.save();
        R.ctx.strokeStyle = this.color;
        R.ctx.beginPath();
        R.ctx.rect(
            this.pos.x | 0,
            this.pos.y | 0,
            this.width,
            this.height
        );
        R.ctx.stroke();
        this.drawAnnouncement();
        R.ctx.restore();
    }
}