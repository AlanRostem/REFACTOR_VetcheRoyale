// Composition class for the right-click ability of a weapon.
// Handles cool-downs and callbacks based on input.
class ModAbility {
    constructor(duration, coolDown) {
        this._currentDuration = 0;
        this._maxDuration = duration;

        this._currentCoolDown = 0;
        this._maxCoolDown = coolDown;

        this._active = false;
        this._onCoolDown = false;
    }

    // Configure cool-down and duration of the ability.
    configureStats(duration, coolDown) {
        this._maxDuration = duration;
        this._maxCoolDown = coolDown;
    }

    update(composedWeapon, entityManager, deltaTime) {
        if (this._active) {
            this.buffs(composedWeapon, entityManager, deltaTime);
            if (this._currentDuration > 0) {
                this._currentDuration -= deltaTime;
            } else {
                this.deActivate(composedWeapon, entityManager, deltaTime);
            }
        } else if (this._onCoolDown) {
            if (this._currentCoolDown > 0) {
                this._currentCoolDown -= deltaTime;
            } else {
                this._currentCoolDown = 0;
                this._onCoolDown = false;
            }
        }
    }

    // Callback when deactivating the ability.
    onDeactivation(composedWeapon, entityManager, deltaTime) {

    }

    deActivate(composedWeapon, entityManager, deltaTime) {
        this._active = false;
        this._currentDuration = 0;
        this._currentCoolDown = this._maxCoolDown;
        this._onCoolDown = true;
        this.onDeactivation(composedWeapon, entityManager, deltaTime);
    }

    // Callback when activating the ability.
    onActivation(composedWeapon, entityManager, deltaTime) {

    }

    activate(composedWeapon, entityManager, deltaTime) {
        if (!this._active && !this._onCoolDown) {
            this.onActivation(composedWeapon, entityManager, deltaTime);
            this._currentDuration = this._maxDuration;
            this._active = true;
        }
    }

    // Overridable looping method for what happens while
    // the ability is active.
    buffs(composedWeapon, entityManager, deltaTime) {

    }

    get active() {
        return this._active;
    }

    get isOnCoolDown() {
        return this._onCoolDown;
    }
}

module.exports = ModAbility;