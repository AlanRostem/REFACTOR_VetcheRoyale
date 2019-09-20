import CTimer from "../../shared/code/Tools/CTimer.js";

export default class CGameEvent {

    constructor(name, type, arg, color , life) {
        this.name = name;
        this.type = type;
        this.color = color;
        this.arg = arg;
        this.dead = false;
        this.life = new CTimer(life, () => {
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
