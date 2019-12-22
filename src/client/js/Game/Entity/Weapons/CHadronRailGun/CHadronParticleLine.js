import CEntity from "../../CEntity.js";
import {hadronParticleEffect} from "./CHadronRailGun.js"

class CHadronParticleLine extends CEntity {
    onClientSpawn(dataPack, client) {
        super.onClientSpawn(dataPack, client);
    }

    draw() {
        hadronParticleEffect(this.output.p0.x, this.output.p0.y, this.output.p1.x, this.output.p1.y, 1);
    }
}



export default CHadronParticleLine;