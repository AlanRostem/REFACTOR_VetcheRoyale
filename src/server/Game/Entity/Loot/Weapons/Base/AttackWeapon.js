const WeaponItem = require("./WeaponItem.js");
const ModAbility = require("./ModAbility.js");
const SuperAbility = require("./SuperAbility.js");
const Projectile = require("../AttackEntities/Projectile.js");
const FMFullAuto = require("./FMFullAuto.js");

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
    static FiringMechanismClass = FMFullAuto;

    static assignWeaponClassAbilities(classForMod, classForSuper, classForFiringMechanism = FMFullAuto) {
        this.ModAbilityClass = classForMod;
        this.SuperAbilityClass = classForSuper;
        this.FiringMechanismClass = classForFiringMechanism;
    }

    static AttackStats = {
        SPREAD: 0,
        RECOIL: 0,
        BLOOM_REGULATOR: 0,

        CHARGE_TIME: 0,

        BURST_COUNT: 0,
        BURST_DELAY: 0,

        RELOAD_SPEED: 2,
        CLIP_SIZE: 10,
        AMMO_USE_PER_SHOT: 1,
        FIRE_RATE_RPM: 600,
    };

    static overrideAttackStats(reloadSpeed, clipSize, fireRateRPM,
                               ammoUsePerShot = 1, spread = 0, recoil = 0, bloomRegulator = 0,
                               chargeTime = 0, burstCount = 0, burstDelay = 0) {
        this.AttackStats = {};
        this.AttackStats.RELOAD_SPEED = reloadSpeed;
        this.AttackStats.CLIP_SIZE = clipSize;
        this.AttackStats.FIRE_RATE_RPM = fireRateRPM;
        this.AttackStats.AMMO_USE_PER_SHOT = ammoUsePerShot;
        this.AttackStats.SPREAD = spread;
        this.AttackStats.RECOIL = recoil;
        this.AttackStats.BLOOM_REGULATOR = bloomRegulator;
        this.AttackStats.CHARGE_TIME = chargeTime;
        this.AttackStats.BURST_COUNT = burstCount;
        this.AttackStats.BURST_DELAY = burstDelay;
    }

    constructor(x, y) {
        super(x, y);
        this.modAbility = new this.constructor.ModAbilityClass();
        this.superAbility = new this.constructor.SuperAbilityClass();
        this.superChargeData = 0;
        this.modCoolDownData = 0;
        this.firerer = new this.constructor.FiringMechanismClass(this);
        this.firing = false;
        this.spreadAngle = 0;
        this.canUseSuper = false;
        this.canUseMod = true;
        this.canFire = true;
        this.modActive = false;
        this.superActive = false;
        this.modAbilityData = {};

        this.currentAmmo = this.constructor.AttackStats.CLIP_SIZE;

        this.currentReloadTime = 0;

        this.currentFireTime = 0;
        this.reloading = false;
    }

    get superCharge() {
        return this.superAbility.currentCharge;
    }

    set superCharge(val) {
        this.superAbility.currentCharge += val;
        if (this.superAbility.currentCharge > SuperAbility.MAX_CHARGE) {
            this.superAbility.currentCharge = SuperAbility.MAX_CHARGE;
        }
    }

    onFireButton(entityManager, deltaTime) {

    }

    // When the player gets a kill, this function is called.
    grantSuperCharge() {
        this.superCharge += this.superAbility.constructor.Stats.CHARGE_GAIN_PER_KILL;
    }

    // Configures all stats for the primary attack of the weapon.


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
            new Projectile(player, 0, 0, 2, 2,
                angle, 200));
    }

    configureAccuracy(spread, recoil, accurator) {
        this.firerer.recoil = recoil;
        this.firerer.defaultSpread = spread;
        this.firerer.accurator = accurator;
    }

    // Called when pressing the reload key.
    activateReloadAction() {
        if (this.currentAmmo < this.constructor.AttackStats.CLIP_SIZE) {
            this.reloading = true;
            this.canFire = false;
            this.currentReloadTime = this.constructor.AttackStats.RELOAD_SPEED;
        }
    }

    // Adds ammo to the clip with correct calculations.
    reload(player) {
        if (this.constructor.AttackStats.CLIP_SIZE > this.currentAmmo) {
            if (player.inventory.ammo > (this.constructor.AttackStats.CLIP_SIZE - this.currentAmmo)) {
                let ammoDiff = this.constructor.AttackStats.CLIP_SIZE - this.currentAmmo;
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

        if (this.canUseSuper) {
            if (player.input.singleKeyPress(81)) {
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