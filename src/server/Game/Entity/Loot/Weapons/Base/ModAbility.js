// Composition class for the right-click ability of a weapon.
// Handles cool-downs and callbacks based on input.
class ModAbility {
    constructor() {
        this.currentDuration = 0;
        this.maxDuration = this.constructor.Stats.MAX_DURATION;

        this.isResourceMeter = this.constructor.Stats.IS_RESOURCE_METER;
        this.justConsumed = false;
        this.consumptionTime = this.constructor.Stats.CONSUMPTION_TIME;

        this.currentCoolDown = 0;
        this.maxCoolDown = this.constructor.Stats.MAX_COOL_DOWN;

        this.active = false;
        this.onCoolDown = false;

        this.data = {};
    }

    static Stats = {
        MAX_DURATION: 1,
        MAX_COOL_DOWN: 1,
        IS_RESOURCE_METER: false,
        CONSUMPTION_TIME: 0.16,
        IS_CONSTANT: false
    };

    // Configure cool-down and duration of the ability.
    static configureStats(duration, coolDown, isResourceMeter = false, consumptionTime = 0.16, isConstant = false) {
        this.Stats = {
            MAX_DURATION: duration,
            MAX_COOL_DOWN: coolDown,
            IS_RESOURCE_METER: isResourceMeter,
            CONSUMPTION_TIME: consumptionTime,
            IS_CONSTANT: isConstant
        };
    }

    update(composedWeapon, entityManager, deltaTime) {
        composedWeapon.modActive = this.active;
        this.data = {
            currentDuration: this.currentDuration,
            maxDuration: this.maxDuration,
            currentCoolDown: this.currentCoolDown,
            maxCoolDown: this.maxCoolDown,
            active: this.active,
            onCoolDown: this.onCoolDown,
        };

        if (this.isResourceMeter) {
            if (composedWeapon.hasOwner()) {
                let player = composedWeapon.getOwner();
                if (!this.onCoolDown) {
                    if (player.input.heldDownMapping("modAbility") && this.active) {
                        if (!this.justConsumed) {
                            this.currentDuration -= this.consumptionTime;
                            this.justConsumed = true;
                        }
                        this.buffs(composedWeapon, entityManager, deltaTime);
                        if (this.currentDuration > 0) {
                            this.currentDuration -= deltaTime;
                        } else {
                            this.deActivate(composedWeapon, entityManager, deltaTime);
                        }
                    } else {
                        this.justConsumed = false;
                        this.onDeactivation(composedWeapon, entityManager, deltaTime);
                        if (this.currentDuration < this.maxDuration) {
                            this.currentDuration += deltaTime;
                        } else {
                            this.currentDuration = this.maxDuration;
                        }
                    }
                } else {
                    if (this.currentCoolDown > 0) {
                        this.currentCoolDown -= deltaTime;
                    } else {
                        this.currentCoolDown = 0;
                        this.onCoolDown = false;
                    }
                }
            }
        } else {
            if (this.active) {
                this.buffs(composedWeapon, entityManager, deltaTime);
                if (this.currentDuration > 0) {
                    if (!this.constructor.Stats.IS_CONSTANT)
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

        }
        composedWeapon.canUseMod = !this.active || !this.onCoolDown;
    }

    // Callback when deactivating the ability.
    onDeactivation(composedWeapon, entityManager, deltaTime) {
        //composedWeapon.onModDeactivation(entityManager, deltaTime);
    }

    deActivate(composedWeapon, entityManager, deltaTime) {
        this.active = false;
        if (!this.constructor.Stats.IS_CONSTANT) {
            this.currentCoolDown = this.maxCoolDown;
            this.onCoolDown = true;
        }
        this.onDeactivation(composedWeapon, entityManager, deltaTime);
    }

    // Callback when activating the ability.
    onActivation(composedWeapon, entityManager, deltaTime) {

    }

    activate(composedWeapon, entityManager, deltaTime) {
        if (!this.active && !this.onCoolDown) {
            this.onActivation(composedWeapon, entityManager, deltaTime);
            //composedWeapon.onModActivation(entityManager, deltaTime);
            this.currentDuration = this.maxDuration;
            this.active = true;
        }
    }

    // Overridable looping method for what happens while
    // the ability is active.
    buffs(composedWeapon, entityManager, deltaTime) {
        //composedWeapon.onModBuffs(entityManager, deltaTime);
    }

    get isOnCoolDown() {
        return this.onCoolDown;
    }
}

module.exports = ModAbility;