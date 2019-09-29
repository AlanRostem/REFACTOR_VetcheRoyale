import CTimer from "../../shared/code/Tools/CTimer.js";

export default class CGameEvent {

    constructor(e) {
        this.id = e.id;
        this.type = e.type;
        this.color = e.color;
        this.arg = e.arg;
        this.dead = false;
        this.life = new CTimer(e.life, () => {
            this.dead = true;
        });
    }

    update(delaTime){
        this.life.tick(delaTime)
    }

    getEvent(){
        return this;
    }
}
