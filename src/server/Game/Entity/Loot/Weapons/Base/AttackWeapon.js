const WeaponItem = require("./WeaponItem.js");
const ModAbility = require("./ModAbility.js");
const SuperAbility = require("./SuperAbility.js");
const Projectile = require("../AttackEntities/Projectile.js");
const Firerer = require("./Firerer.js");

// Composition abstraction class for the weapon abilities.
// It extends the item version of the weapon. When the player
// picks up the weapon all tileCollision of the item version is
// disabled and follows the player.
class AttackWeapon extends WeaponItem {
    constructor(x, y,
                displayName, weaponClass = "pistol",
                modDuration = 5, modCoolDown = 5, superDuration = 3, superChargeGainTick = 3, superChargeGainKill = 15,
                spread = 0, recoil = 0, accurator = 0,
                chargeSeconds = 0, burstCount = 0, burstDelay = 0) {
        super(x, y, displayName, weaponClass);
        this._modAbility = new ModAbility(modDuration, modCoolDown);
        this._superAbility = new SuperAbility(superDuration, superChargeGainTick, superChargeGainKill);
        this._superCharge = 0;
        this._modCoolDown = 0;
        this._firerer = new Firerer(chargeSeconds, burstCount, burstDelay, spread, recoil, accurator);
        this._firing = false;
        this._holdingDownFireButton = false;
        this._spreadAngle = 0;
        this._canUseSuper = true;
        this._canUseMod = true;
        this._canFire = true;
        this.configureAttackStats(2, 10, 1, 600);
        this.addDynamicSnapShotData([
            "_superCharge",
            "_modCoolDown",
            "_currentAmmo",
            "_spreadAngle",
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

    onSuperActivation(entityManager, deltaTime) {

    }

    onModActivation(entityManager, deltaTime) {

    }

    // Override to new ability object
    setModAbility(overridden) {
        this._modAbility = overridden;
    }

    // Override to new ability object
    setSuperAbility(overridden) {
        this._superAbility = overridden;
    }

    onFireButton(entityManager, deltaTime) {

    }

    // When the player gets a kill, this function is called.
    grantSuperCharge() {
        this.superCharge += this._superAbility._killChargeGain;
    }

    // Configures all stats for the primary attack of the weapon.
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

    // Happens when the player drops the weapon. Good for resetting
    // certain abilities to retain the flow of the game.
    onDrop(player, entityManager, deltaTime) {
        if (this._modAbility._active) {
            this._modAbility.deActivate(this, entityManager, deltaTime);
        }
        this._currentReloadTime = 0;
        this._reloading = false;
    }

    // Overridable method for when the weapon fires.
    // Is called at the rate of fire. Spawn any damaging
    // entity or call hit-scans depending on the weapon idea.
    fire(player, entityManager, deltaTime, angle) {
        entityManager.spawnEntity(this.center.x, this.center.y,
            new Projectile(player.id, 0, 0, 2, 2,
                angle, 200));
    }

    configureAccuracy(spread, recoil, accurator) {
        this._firerer._recoil = recoil;
        this._firerer._defaultSpread = spread;
        this._firerer._accurator = accurator;
    }

    // Called when pressing the reload key.
    activateReloadAction() {
        if (this._currentAmmo < this._maxAmmo) {
            this._reloading = true;
            this._canFire = false;
            this._currentReloadTime = this._maxReloadTime;
        }
    }

    // Adds ammo to the clip with correct calculations.
    reload(player) {
        if (this._maxAmmo > this._currentAmmo) {
            if (player.inventory.ammo > (this._maxAmmo - this._currentAmmo)) {
                let ammoDiff = this._maxAmmo - this._currentAmmo;
                this._currentAmmo += ammoDiff;
                player.inventory.ammo -= ammoDiff;
                this._canFire = true;
            } else {
                this._currentAmmo += player.inventory.ammo;
                player.inventory.ammo = 0;
                this._canFire = true;
            }
        }
    }

    // Listens to mouse and key input to perform different actions
    // on the weapon such as firing, ability usage and reloading.
    listenToInput(player, entityManager, deltaTime) {

        this._firerer.update(this, player, entityManager, deltaTime);

        if (player.input.singleMousePress(3)) {
            if (this._canUseMod) {
                this._modAbility.activate(this, entityManager, deltaTime);
            }
        }

        if (player.input.singleKeyPress(81)) {
            if (this._canUseSuper) {
                this._superAbility.activate(this, entityManager, deltaTime);
            }
        }

        // Reload when inventory ammo is over zero.
        if (player.input.singleKeyPress(82)) {
            if (!player.input.mouseHeldDown(1)) {
                if (player.inventory.ammo > 0) {
                    this.activateReloadAction();
                }
            }
        }
    }

    // Looping function that is called when the player has
    // picked up the weapon.
    updateWhenEquipped(player, entityManager, deltaTime) {
        this._canFire = this._currentAmmo > 0;
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