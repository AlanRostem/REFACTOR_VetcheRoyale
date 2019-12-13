class SuperAbility {
    static MAX_CHARGE = 100;

    constructor(duration, chargeGainPerTick, chargeGainPerKill) {
        this.currentDuration = 0;
        this.maxDuration = duration;

        this.currentCharge = 0;
        this.currentChargeTickTime = 3;
        this.killChargeGain = chargeGainPerKill;
        this.tickChargeGain = chargeGainPerTick;

        this.fullyCharged = false;
        this.active = false;
    }

    // Configure charge stats and duration of the ability.
    configureStats(duration, tickChargeGain, killChargeGain) {
        this.maxDuration = duration;
        this.tickChargeGain = tickChargeGain;
        this.killChargeGain = killChargeGain;
    }

    update(composedWeapon, entityManager, deltaTime) {
        composedWeapon.superActive = this.active;
        if (this.active) {
            this.buffs(composedWeapon, entityManager, deltaTime);
            if (this.currentDuration > 0) {
                this.currentDuration -= deltaTime;
            } else {
                this.deActivate(composedWeapon, entityManager, deltaTime);
            }
        } else {
            if (this.currentCharge < 100) {
                this.currentChargeTickTime -= deltaTime;
                if (this.currentChargeTickTime <= 0) {
                    this.currentCharge += this.tickChargeGain;
                    this.currentChargeTickTime = 3; // Seconds
                }
            } else {
                this.currentCharge = 100; // In case it adds more than 100
                this.fullyCharged = true;
            }
        }
        composedWeapon.canUseSuper = !this.active;
    }

    // Callback when deactivating the ability.
    onDeactivation(composedWeapon, entityManager, deltaTime) {
        composedWeapon.onSuperDeactivation(entityManager, deltaTime);
    }

    deActivate(composedWeapon, entityManager, deltaTime) {
        this.active = false;
        this.currentDuration = 0;
        this.onDeactivation(composedWeapon, entityManager, deltaTime);
    }

    // Callback when activating the ability.
    onActivation(composedWeapon, entityManager, deltaTime) {

    }

    activate(composedWeapon, entityManager, deltaTime) {
        if (!this.active && this.fullyCharged) {
            this.onActivation(composedWeapon, entityManager, deltaTime);
            composedWeapon.onSuperActivation(entityManager, deltaTime);
            this.currentDuration = this.maxDuration;
            this.currentCharge = 0;
            this.fullyCharged = false;
            this.active = true;
        }
    }

    // Overridable looping method for what happens while
    // the ability is active.
    buffs(composedWeapon, entityManager, deltaTime) {
        composedWeapon.onSuperBuffs(entityManager, deltaTime)
    }

}

module.exports = SuperAbility;