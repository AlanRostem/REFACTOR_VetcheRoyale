const WeaponItem = require("./WeaponItem.js");
const ModAbility = require("./ModAbility.js");
const SuperAbility = require("./SuperAbility.js");
const Projectile = require("../Other/Projectile.js");

// Composition abstraction class for the weapon abilities
class AttackWeapon extends WeaponItem {
    constructor(x, y, modDuration = 5, modCoolDown = 5, superDuration = 3, superChargeGainTick = 3, superChargeGainKill = 15) {
        super(x, y);
        this._modAbility = new ModAbility(modDuration, modCoolDown);
        this._superAbility = new SuperAbility(superDuration, superChargeGainTick, superChargeGainKill);
        this._superCharge = 0;
        this._modCoolDown = 0;
        this.configureAttackStats(2, 10, 1, 600);
        this.addDynamicSnapShotData([
            "_superCharge",
            "_modCoolDown",
            "_currentAmmo"
        ]);
    }

    get isSuperActive() {
        return this._superAbility._active;
    }

    get superCharge() {
        return this._superAbility._currentCharge;
    }

    set superCharge(val) {
        this._superAbility._currentCharge += val;
        if (this._superAbility._currentCharge > 100) {
            this._superAbility._currentCharge = 100;
        }
    }

    setModAbility(overridden) {
        this._modAbility = overridden;
    }

    setSuperAbility(overridden) {
        this._superAbility = overridden;
    }

    configureAttackStats(reloadSpeed, clipSize, ammoUsagePerShot, fireRateRPM) {
        this._currentAmmo = clipSize;
        this._maxAmmo = clipSize;

        this._currentReloadTime = 0;
        this._maxReloadTime = reloadSpeed;

        this._ammoPerShot = ammoUsagePerShot;
        this._fireRate = fireRateRPM;
        this._currentFireTime = 0;
        this._reloading = false;
    }

    onDrop(player, entityManager, deltaTime) {
        this._modAbility.deActivate(this, entityManager, deltaTime);
        this._currentReloadTime = 0;
        this._reloading = false;
    }

    fire(player, entityManager, deltaTime) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new Projectile(player.id, 0, 0, 2, 2,
                player.input.mouseData.cosCenter,
                player.input.mouseData.sinCenter,
                200))
    }

    activateReloadAction() {
        if (this._currentAmmo < this._maxAmmo) {
            this._reloading = true;
            this._currentReloadTime = this._maxReloadTime;
        }
    }

    reload(player) {
        if (this._maxAmmo > this._currentAmmo) {
            if (player.inventory.ammo > (this._maxAmmo - this._currentAmmo)) {
                let ammoDiff = this._maxAmmo - this._currentAmmo;
                this._currentAmmo += ammoDiff;
                player.inventory.ammo -= ammoDiff;
            } else {
                this._currentAmmo += player.inventory.ammo;
                player.inventory.ammo = 0;
            }
        }

        //console.log("Reloaded! Reserve: " + player.inventory.ammo);
    }

    listenToInput(player, entityManager, deltaTime) {
        if (this._currentFireTime > 0) {
            this._currentFireTime -= deltaTime;
        }

        if (player.input.mouseHeldDown(1)) {
            if (this._currentFireTime <= 0 && !this._reloading) {
                this._currentFireTime = 60 / this._fireRate;
                if (this._currentAmmo >= this._ammoPerShot) {
                    this.fire(player, entityManager, deltaTime);
                    this._currentAmmo -= this._ammoPerShot;
                } else if (player.inventory.ammo > 0) {
                    this.activateReloadAction();
                }
            }
        }

        if (player.input.singleMousePress(3)) {
            this._modAbility.activate(this, entityManager, deltaTime);
        }

        if (player.input.singleKeyPress(81)) {
            this._superAbility.activate(this, entityManager, deltaTime);
        }

        if (player.input.singleKeyPress(82)) {
            if (player.inventory.ammo > 0) {
                this.activateReloadAction();
            }
        }
    }

    updateWhenEquipped(player, entityManager, deltaTime) {
        super.updateWhenEquipped(player, entityManager, deltaTime);
        this.listenToInput(player, entityManager, deltaTime);
        this._modAbility.update(this, entityManager, deltaTime);
        this._superAbility.update(this, entityManager, deltaTime);
        this._superCharge = this.superCharge;
        this._modCoolDown = this._modAbility._currentCoolDown;

        if (this._reloading) {
            this._currentReloadTime -= deltaTime;
            if (this._currentReloadTime <= 0) {
                this._currentReloadTime = 0;
                this._reloading = false;
                this.reload(player);
            }
        }
    }
}

module.exports = AttackWeapon;