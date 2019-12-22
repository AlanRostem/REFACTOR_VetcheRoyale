const FiringMechanism = require("./FiringMechanism.js")

class FMFullAuto extends FiringMechanism {
    onCanFire(weapon, player, entityManager, deltaTime) {
        this.doSingleFire(weapon, player, entityManager, deltaTime);
    }
}

module.exports = FMFullAuto;