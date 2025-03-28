import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import CTimer from "../../../shared/code/Tools/CTimer.js";
import Scene from "../Game/Scene.js";

/**
 *
 */
class Announcement extends UIElement {
    /**
     * Sets UI image and timer for event position
     */
    constructor() {
        super("announcement", R.WIDTH / 2 - 64 | 0, 0, 128, 18);
        this.pos.y = -this.height - 4;
        this.event = undefined;

        this.timer = new CTimer(0.01, () => {
            if (this.event !== undefined && this.pos.y >= 0)
                this.event.arg.x--;
        });

        Scene.eventManager.addEventReceiver(this.id, this,(ev)=>{
            return !ev.arg.hasOwnProperty('shown') &&
                ev.arg.hasOwnProperty('string')
        });
    }

    /**
     * Adds an event to be displayed and adds properties to the event
     * @param e {CGameEvent} - Event to be displayed
     */
    addEvent(e) {
        if (this.event === undefined)
        if (Array.isArray(e) && e.length > 0) {
            this.event = e[0];
            this.event.arg.shown = true;
            this.event.arg.dString = "";
            this.event.arg.x = this.width - 10;
        }
    }

    /**
     * Finds the substring to display
     */
    updateEvent() {
        if (this.event !== undefined) {
            this.start = this.event.arg.x <= 0 ? -this.event.arg.x / 5 | 0 : 0;
            this.event.arg.dString = this.event.arg.string.substring(
                this.start,
                (this.width - this.event.arg.x - 5) / 5 | 0);
            if (this.event.arg.x + this.event.arg.string.length * 5 - 1 <= 0 )
                this.event = undefined;

        }
    }

    /**
     * Removes the announcementbox if there is no event to display
     */
    animation() {
        if (this.event !== undefined) {
            if (this.pos.y < 0)
                this.pos.y++;
        } else {
            if (this.pos.y >= -this.height - 4) {
                this.pos.y--;
            }
        }
    }

    /**
     *
     * @param deltaTime {int} - Deltatime between game ticks
     * @param client {Client} - The client
     * @param entityList {EntityManager} - List of entities
     */
    update(deltaTime, client, entityList) {
        this.pos.x = R.WIDTH / 2 - 64 | 0;
        this.animation();
        this.updateEvent();
        this.timer.tick(deltaTime);
    }

    /**
     *
     */
    draw() {
        if (this.pos.y > -this.height - 4) {

            R.ctx.drawImage(
                AssetManager.getMapImage("announcementBoxBackground"),
                this.pos.x,
                this.pos.y + 6,
                this.width - 10,
                this.height - 4,
            );
            /*
            UIElement.defaultSpriteSheet.drawCropped(

                0, 110,
                118, 14,
                this.pos.x,
                this.pos.y + 6,
                this.width - 10,
                this.height - 4,
            );*/

            if (this.event !== undefined) {
                R.drawText(
                    this.event.arg.dString,
                    this.pos.x + this.event.arg.x + this.start * 5 + 1,
                    this.pos.y + 11, this.event.color
                );
            }


            R.ctx.drawImage(
                AssetManager.getMapImage("announcementBoxFrame"),
                this.pos.x - 5,
                this.pos.y,
                this.width,
                this.height + 4,
            );

            UIElement.defaultSpriteSheet.drawCropped(
                0, 88,
                128, 22,
                this.pos.x - 5,
                this.pos.y,
                this.width,
                this.height + 4,
            );
        }
    }
}

export default Announcement;
