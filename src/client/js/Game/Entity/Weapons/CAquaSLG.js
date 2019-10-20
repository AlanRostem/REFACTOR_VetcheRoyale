import CWeapon from "./CWeapon.js";
import Scene from "../../Scene.js";
import R from "../../../Graphics/Renderer.js";

export default class CAquaSLG extends CWeapon {

    constructor(data) {
        super(data, 5);

    }

    onFire(client, deltaTime) {
        super.onFire(client, deltaTime);

    }

    update(deltaTime, client) {
        this.player = Scene.entityManager.getEntityByID(this.output.playerID);
        super.update(deltaTime, client);
    }

    draw() {
        super.draw();
        R.ctx.save();

        R.ctx.restore();
    }

}