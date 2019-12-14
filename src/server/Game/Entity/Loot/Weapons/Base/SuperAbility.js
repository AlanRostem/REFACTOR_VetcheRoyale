class SuperAbility {
    static MAX_CHARGE = 100;
    static MIN_CHARGE = 0;
    static CHARGE_UP_TICK_TIME = 3; // Seconds
    static Stats = {
        MAX_DURATION: 1,
        CHARGE_GAIN_PER_TICK: 100, //5, // TODO: Add back
        CHARGE_GAIN_PER_KILL: 25,
    };
    // Configure charge stats and duration of the ability.
    static configureStats(duration, tickChargeGain = 100, killChargeGain = 25) {
        this.Stats = {};
        this.Stats.MAX_DURATION = duration;
        this.Stats.CHARGE_GAIN_PER_TICK = tickChargeGain;
        this.Stats.CHARGE_GAIN_PER_KILL = killChargeGain;
    }

    constructor() {
        this.currentDuration = 0;
        this.currentCharge = 0;
        this.currentChargeTickTime = 3;
        this.fullyCharged = false;
        this.active = false;
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
            if (this.currentCharge < SuperAbility.MAX_CHARGE) {
                this.currentChargeTickTime -= deltaTime;
                if (this.currentChargeTickTime <= 0) {
                    this.currentCharge += this.constructor.Stats.CHARGE_GAIN_PER_TICK;
                    this.currentChargeTickTime = SuperAbility.CHARGE_UP_TICK_TIME; // Seconds
                }
            } else {
                this.currentCharge = SuperAbility.MAX_CHARGE; // In case it adds more than 100
                this.fullyCharged = true;
            }
        }
        composedWeapon.canUseSuper = !this.active;
    }

    // Callback when deactivating the ability.
    onDeactivation(composedWeapon, entityManager, deltaTime) {

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
            this.currentDuration = this.constructor.Stats.MAX_DURATION;
            this.currentCharge = 0;
            this.fullyCharged = false;
            this.active = true;
        }
    }

    // Overridable looping method for what happens while
    // the ability is active.
    buffs(composedWeapon, entityManager, deltaTime) {

    }

}

module.exports = SuperAbility;