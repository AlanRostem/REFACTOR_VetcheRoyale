const HitScanWeapon = require("./Base/HitScanWeapon.js");
const ModAbility = require("./Base/ModAbility.js");
const SuperAbility = require("./Base/SuperAbility.js");
const Projectile = require("./AttackEntities/Projectile.js");
const Damage = require("../../../Mechanics/Damage/Damage.js");
const HitScanner = require("../../../Mechanics/Scanners/HitScanner.js");
const Vector2D = require("../../../../../shared/code/Math/SVector2D.js");
const SEntity = require("../../SEntity.js");
const Alive = require("../../Traits/Alive.js");

class HadronRailGun extends HitScanWeapon {
    static _ = (() => {
        HadronRailGun.setMaxRange(128);
        HadronRailGun.addDynamicValues("scanHitPos");
        HadronRailGun.overrideAttackStats(2.2, 7, 20, 1, 0,0,
            0, 1);
    })();
}

module.exports = HadronRailGun;