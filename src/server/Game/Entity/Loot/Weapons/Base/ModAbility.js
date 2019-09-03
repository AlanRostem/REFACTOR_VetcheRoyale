// Composition class for the right-click ability of a weapon.
// Handles cool-downs and callbacks based on input.
class ModAbility {
    constructor(duration, coolDown) {
        this.currentDuration = 0;
        this.maxDuration = duration;

        this.currentCoolDown = 0;
        this.maxCoolDown = coolDown;

        this.active = false;
        this.onCoolDown = false;
    }

    // Configure cool-down and duration of the ability.
    configureStats(duration, coolDown) {
        this.maxDuration = duration;
        this.maxCoolDown = coolDown;
    }



    update(composedWeapon, entityManager, deltaTime) {
        composedWeapon.modActive = this.active;
        if (this.active) {
            this.buffs(composedWeapon, entityManager, deltaTime);
            if (this.currentDuration > 0) {
                this.currentDuration -= deltaTime;
            } else {
                this.deActivate(composedWeapon, entityManager, deltaTime);
            }
        } else if (this.onCoolDown) {
            if (this.currentCoolDown > 0) {
                this.currentCoolDown -= deltaTime;
            } else {
                this.currentCoolDown = 0;
                this.onCoolDown = false;
            }
        }
        composedWeapon.canUseMod = !this.active || !this.onCoolDown;
    }

    // Callback when deactivating the ability.
    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.onModDeactivation(entityManager, deltaTime);
    }

    deActivate(composedWeapon, entityManager, deltaTime) {
        this.active = false;
        this.currentDuration = 0;
        this.currentCoolDown = this.maxCoolDown;
        this.onCoolDown = true;
        this.onDeactivation(composedWeapon, entityManager, deltaTime);
    }

    // Callback when activating the ability.
    onActivation(composedWeapon, entityManager, deltaTime) {

    }

    activate(composedWeapon, entityManager, deltaTime) {
        if (!this.active && !this.onCoolDown) {
            this.onActivation(composedWeapon, entityManager, deltaTime);
            composedWeapon.onModActivation(entityManager, deltaTime);
            this.currentDuration = this.maxDuration;
            this.active = true;
        }
    }

    // Overridable looping method for what happens while
    // the ability is active.
    buffs(composedWeapon, entityManager, deltaTime) {
        composedWeapon.onModBuffs(entityManager, deltaTime);
    }

    get isOnCoolDown() {
        return this.onCoolDown;
    }
}

module.exports = ModAbility;