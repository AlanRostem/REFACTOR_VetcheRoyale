import CEntity from "./CEntity.js";

export default class CLoot extends CEntity {
    constructor(data) {
        super(data);
        this.isClose = false;
        this.PICK_UP_RANGE = 8 * 2;
        this.nextFalse = false;
    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        if(this.nextFalse) this.isClose = this.nextFalse = false;
        if(this.isClose) this.nextFalse = true;
    }

    canPickUp(player) {
        return true;
    }

}