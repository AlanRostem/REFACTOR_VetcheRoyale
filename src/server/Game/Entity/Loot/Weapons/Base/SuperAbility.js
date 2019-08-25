class SuperAbility {
    constructor(duration, chargeGainPerTick, chargeGainPerKill) {
        this._currentDuration = 0;
        this._maxDuration = duration;

        this._currentCharge = 0;
        this._currentChargeTickTime = 3;
        this._killChargeGain = chargeGainPerKill;
        this._tickChargeGain = chargeGainPerTick;

        this._fullyCharged = false;
        this._active = false;
    }

    // Configure charge stats and duration of the ability.
    configureStats(duration, tickChargeGain, killChargeGain) {
        this._maxDuration = duration;
        this._tickChargeGain = tickChargeGain;
        this._killChargeGain = killChargeGain;
    }

    update(composedWeapon, entityManager, deltaTime) {
        if (this._active) {
            this.buffs(composedWeapon, entityManager, deltaTime);
            if (this._currentDuration > 0) {
                this._currentDuration -= deltaTime;
            } else {
                this.deActivate(composedWeapon, entityManager, deltaTime);
            }
        } else {
            if (this._currentCharge < 100) {
                this._currentChargeTickTime -= deltaTime;
                if (this._currentChargeTickTime <= 0) {
                    this._currentCharge += this._tickChargeGain;
                    this._currentChargeTickTime = 3; // Seconds
                }
            } else {
                this._currentCharge = 100; // In case it adds more than 100
                this._fullyCharged = true;
            }
        }
    }

    // Callback when deactivating the ability.
    onDeactivation(composedWeapon, entityManager, deltaTime) {

    }

    deActivate(composedWeapon, entityManager, deltaTime) {
        this._active = false;
        this._currentDuration = 0;
        this.onDeactivation(composedWeapon, entityManager, deltaTime);
    }

    // Callback when activating the ability.
    onActivation(composedWeapon, entityManager, deltaTime) {

    }

    activate(composedWeapon, entityManager, deltaTime) {
        if (!this._active && this._fullyCharged) {
            this.onActivation(composedWeapon, entityManager, deltaTime);
            composedWeapon.onSuperActivation(entityManager, deltaTime);
            this._currentDuration = this._maxDuration;
            this._currentCharge = 0;
            this._fullyCharged = false;
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
}

module.exports = SuperAbility;