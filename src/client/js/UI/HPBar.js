import R from "../Graphics/Renderer.js";
import UIElement from "./UIElement.js";
import Vector2D from "../../../shared/code/Math/CVector2D.js";
import SpriteSheet from "../AssetManager/Classes/Graphical/SpriteSheet.js";

export default class HPBar extends UIElement {
    constructor() {
        super("hpbar", 0, 0, 32, 32);
        this.src = AssetManager.get("ui/ui.png");

        this.glassTube = new Vector2D(54, 12); // Old 80 and 76
        this.HPjuice = new Vector2D(50, 8);

        this.HPlength = 0;

        this.animation = new SpriteSheet.Animation(0, 11 - 1, 3, 0.1);
        UIElement.defaultSpriteSheet.bind("HPLiquid", 54, 0, 150, 32);

    }

    update(deltaTime, client, entityList) {
        if (client.player)
            this.HPlength = client.player.output.hp * this.HPjuice.x / 100 | 0;
    }

    draw() {
        R.ctx.save();
        /*
        R.drawText("B.I.G Motorizer\n" +
            "Description: Motor driven death machine.\n" +
            "Ammo Capacity: 36\n" +
            "Primary Attack: Charge-up salvo: Rapid-6-shot-burst micro missile launcher. Missiles travel harmonically. Needs to be charged up to fire. \n" +
            "Mod: Thunder pulse: Use the charge-up motor to generate an EMP beam that stuns enemies.\n" +
            "Super: Transform: Transform the weapon up to 3 times to give it upgrades.\n" +
            "1st form: Turbo Engine - No charge-up time and full auto but fire at a slower fire rate that builds up as you fire.\n" +
            "2nd form: Induction Motor - Use Thunder Pulse as you fire.\n" +
            "3rd form: Precision Choke - Rounds travel directly\n" +
            "\n" +
            "\n" +
            "\n", 0, 0, "Green", false, 200);
        */


        if (this.HPlength === 0) {
            return;
        }

        // Liquid Inside
     /*   UIElement.defaultSpriteSheet.drawCropped(
            0,
            this.glassTube.y,
            this.HPlength,
            this.HPjuice.y,
            6,
            R.HEIGHT - this.glassTube.y - 2,
            this.HPlength,
            this.HPjuice.y,
        );*/


        // Liquid Top
        UIElement.defaultSpriteSheet.animate("HPLiquid", this.animation, 50, 8);
        UIElement.defaultSpriteSheet.drawCroppedAnimated(
            0,
            0,
            this.HPlength,
            this.HPjuice.y,
            6,
            R.HEIGHT - this.glassTube.y - 2,
            this.HPlength,
            this.HPjuice.y);
        //

        // Draw Glass Tube
        UIElement.defaultSpriteSheet.drawCropped(
            0,
            0,
            this.glassTube.x,
            this.glassTube.y,
            4,
            R.HEIGHT - this.glassTube.y - 4 | 0,
            this.glassTube.x,
            this.glassTube.y);

        R.ctx.restore();
    }

}