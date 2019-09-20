import CTimer from "../../shared/code/Tools/CTimer.js";

export default class CGameEvent {
    constructor(name, type, arg , life = 5) {
        this.name = name;
        this.type = type;
        this.arg = arg;
        this.dead = false;
        this.life = new CTimer(5, () => {
            this.dead = true;
            console.log(true, this.name);
            delete this;
        });
    }

    update(delaTime){
        this.life.tick(delaTime)
    }

    getEvent(){
        return this;
    }
}
