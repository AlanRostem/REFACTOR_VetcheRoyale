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
    static _ = (() => {
        AttackWeapon.addDynamicValues("superChargeData",
            "canUseSuper",
            "modCoolDownData",
            "canUseMod",
            "currentAmmo",
            "spreadAngle",
            "firing",
            "modActive",
            "superActive",
            "modAbilityData",
            "reloading");
    })();

    static ModAbilityClass = ModAbility;
    static SuperAbilityClass = SuperAbility;

    static assignWeaponClassAbilities(classForMod, classForSuper) {
        this.ModAbilityClass = classForMod;
        this.SuperAbilityClass = classForSuper;
    }

    constructor(x, y,
                spread = 0, recoil = 0, accurator = 0,
                chargeSeconds = 0, burstCount = 0, burstDelay = 0) {
        super(x, y);
        this.modAbility = new this.constructor.ModAbilityClass();
        this.superAbility = new this.constructor.SuperAbilityClass();
        this.superChargeData = 0;
        this.modCoolDownData = 0;
        this.firerer = new Firerer(chargeSeconds, burstCount, burstDelay, spread, recoil, accurator);
        this.firing = false;
        this.spreadAngle = 0;
        this.canUseSuper = true;
        this.canUseMod = true;
        this.canFire = true;
        this.modActive = false;
        this.superActive = false;
        this.modAbilityData = {};
        this.configureAttackStats(2, 10, 1, 600);

    }

    get isSuperActive() {
        return this.superAbility.active;
    }

    get superCharge() {
        return this.superAbility.currentCharge;
    }

    set superCharge(val) {
        this.superAbility.currentCharge += val;
        if (this.superAbility.currentCharge > 100) {
            this.superAbility.currentCharge = 100;
        }
    }

    onSuperActivation(entityManager, deltaTime) {

    }

    onSuperBuffs(entityManager, deltaTime) {

    }

    onSuperDeactivation(entityManager, deltaTime) {

    }

    onModActivation(entityManager, deltaTime) {

    }

    onModBuffs(entityManager, deltaTime) {

    }

    onModDeactivation(entityManager, deltaTime) {

    }

    onFireButton(entityManager, deltaTime) {

    }

    // When the player gets a kill, this function is called.
    grantSuperCharge() {
        this.superCharge += this.superAbility.killChargeGain;
    }

    // Configures all stats for the primary attack of the weapon.
    configureAttackStats(reloadSpeed, clipSize, ammoUsagePerShot, fireRateRPM) {
        this.currentAmmo = clipSize;
        this.maxAmmo = clipSize;

        this.currentReloadTime = 0;
        this.maxReloadTime = reloadSpeed;

        this.ammoPerShot = ammoUsagePerShot;
        this.fireRate = fireRateRPM;
        this.currentFireTime = 0;
        this.reloading = false;
    }

    // Happens when the player drops the weapon. Good for resetting
    // certain abilities to retain the flow of the game.
    onDrop(player, entityManager, deltaTime) {
        if (this.modAbility.active) {
            this.modAbility.deActivate(this, entityManager, deltaTime);
        }
        if (this.superAbility.active) {
            this.superAbility.deActivate(this, entityManager, deltaTime);
        }
        this.firerer.reset();
        this.currentReloadTime = 0;
        this.reloading = false;
        this.firing = false;
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
        this.firerer.recoil = recoil;
        this.firerer.defaultSpread = spread;
        this.firerer.accurator = accurator;
    }

    // Called when pressing the reload key.
    activateReloadAction() {
        if (this.currentAmmo < this.maxAmmo) {
            this.reloading = true;
            this.canFire = false;
            this.currentReloadTime = this.maxReloadTime;
        }
    }

    // Adds ammo to the clip with correct calculations.
    reload(player) {
        if (this.maxAmmo > this.currentAmmo) {
            if (player.inventory.ammo > (this.maxAmmo - this.currentAmmo)) {
                let ammoDiff = this.maxAmmo - this.currentAmmo;
                this.currentAmmo += ammoDiff;
                player.inventory.ammo -= ammoDiff;
                this.canFire = true;
            } else {
                this.currentAmmo += player.inventory.ammo;
                player.inventory.ammo = 0;
                this.canFire = true;
            }
        }
    }

    // Listens to mouse and key input to perform different actions
    // on the weapon such as firing, ability usage and reloading.
    listenToInput(player, entityManager, deltaTime) {

        this.firerer.update(this, player, entityManager, deltaTime);

        if (player.input.singleMappingPress("modAbility")) {
            if (this.canUseMod) {
                this.modAbility.activate(this, entityManager, deltaTime);
            }
        }

        if (this.canUseSuper && player.input.singleKeyPress(81)) {
            if (this.canUseSuper) {
                this.superAbility.activate(this, entityManager, deltaTime);
            }
        }

        // Reload when inventory ammo is over zero.
        if (player.input.singleKeyPress(82) && !this.reloading) {
            if (player.inventory.ammo > 0) {
                this.activateReloadAction();
            }
        }
    }

    // Looping function that is called when the player has
    // picked up the weapon.
    updateWhenEquipped(player, entityManager, deltaTime) {
        //this.canFire = this.currentAmmo > 0;
        this.modAbilityData = this.modAbility.data;
        super.updateWhenEquipped(player, entityManager, deltaTime);
        this.listenToInput(player, entityManager, deltaTime);
        this.modAbility.update(this, entityManager, deltaTime);
        this.superAbility.update(this, entityManager, deltaTime);
        this.superChargeData = this.superAbility.currentCharge;
        this.modCoolDownData = this.modAbility.currentCoolDown;

        this.canUseMod = this.modAbility.currentCoolDown === SuperAbility.MIN_CHARGE;
        this.canUseSuper = this.superAbility.currentCharge === SuperAbility.MAX_CHARGE;

        if (this.reloading) {
            this.currentReloadTime -= deltaTime;
            if (this.currentReloadTime <= 0) {
                this.currentReloadTime = 0;
                this.reloading = false;
                this.reload(player);
            }
        }
    }
}

module.exports = AttackWeapon;