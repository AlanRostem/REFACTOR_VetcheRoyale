import CEntity from "../CEntity.js";
import OtherPlayer from "../Player/OtherPlayer.js";
import UserPlayer from "../Player/UserPlayer.js";
import CWeapon from "../Weapons/CWeapon.js";
import CBottle from "../CBottle.js";
import CPortal from "../CPortal.js";
import CKE_6H from "../Weapons/CKE_6H/CKE_6H.js";
import CBIGMotorizer from "../Weapons/CBIGMotorizer/CBIGMotorizer.js";
import CSEW_9 from "../Weapons/CSEW_9/CSEW_9.js";
import CCKER90 from "../Weapons/CCKER90/CCKER90.js";
import CInterlux from "../Weapons/CInterlux.js";
import Invisible from "../Invisible.js";
import CElectricSphere from "../Weapons/CSEW_9/CElectricSphere.js";
import CKineticBomb from "../Weapons/CKE_6H/CKineticBomb.js";
import CMicroMissile from "../Weapons/CBIGMotorizer/CMicroMissile.js";
import CAquaSLG from "../Weapons/CAquaSLG/CAquaSLG.js";
import CFirewall from "../Weapons/CFirewall/CFirewall.js";
import CIceBullet from "../Weapons/CAquaSLG/CIceBullet.js";
import CFirepellet from "../Weapons/CFirewall/CFirepellet.js";
import CSeekerSmoke from "../Weapons/CCKER90/CSeekerSmoke.js";
import CATBullet from "../Weapons/CCKER90/CATBullet.js";
import CHadronRailGun from "../Weapons/CHadronRailGun/CHadronRailGun.js";
import CHadronParticleLine from "../Weapons/CHadronRailGun/CHadronParticleLine.js";

/**
 * Creates client versions of inbound entity data by mapping extended classes (CEntity) to the entity
 * constructor name from the server.
 * @see CEntity
 * @type {object}
 * @memberOf ClientSide
 * @namespace
 */
const EntityTypeSpawner = {
    functions: {},

    /**
     * Map a class type (extends CEntity) to a constructor name of the respective server entity
     * @param name {string} - server entity constructor name
     * @param classType {Function} - Class constructor
     * @memberOf EntityTypeSpawner
     */
    createSpawner(name, classType) {
        EntityTypeSpawner.functions[name] = data => {
            return new classType(data);
        }
    },
    spawn(name, data, client) {
        if (!EntityTypeSpawner.functions[name]) {
            console.warn("Entity with name " + name + " does not exist in the spawner.");
            return new CEntity(data);
        }
        if (client.id === data.init.id)
            return new UserPlayer(data);

        return EntityTypeSpawner.functions[name](data);
    }
};


EntityTypeSpawner.createSpawner("Player", OtherPlayer);
EntityTypeSpawner.createSpawner("SEntity", CEntity);

EntityTypeSpawner.createSpawner("Bottle", CBottle);
EntityTypeSpawner.createSpawner("Portal", CPortal);

EntityTypeSpawner.createSpawner("AttackWeapon", CWeapon);

EntityTypeSpawner.createSpawner("BIGMotorizer", CBIGMotorizer);

EntityTypeSpawner.createSpawner("CKER90", CCKER90);
EntityTypeSpawner.createSpawner("KE_6H", CKE_6H);
EntityTypeSpawner.createSpawner("SEW_9", CSEW_9);
EntityTypeSpawner.createSpawner("Interlux", CInterlux);
EntityTypeSpawner.createSpawner("AquaSLG", CAquaSLG);
EntityTypeSpawner.createSpawner("Firewall", CFirewall);

EntityTypeSpawner.createSpawner("SuperDamage", Invisible);
EntityTypeSpawner.createSpawner("FireDamage", Invisible);
EntityTypeSpawner.createSpawner("ElectricSphere", CElectricSphere);
EntityTypeSpawner.createSpawner("KineticBomb", CKineticBomb);
EntityTypeSpawner.createSpawner("MicroMissile", CMicroMissile);
EntityTypeSpawner.createSpawner("IceBullet", CIceBullet);
EntityTypeSpawner.createSpawner("Firepellet", CFirepellet);
EntityTypeSpawner.createSpawner("ATBullet", CATBullet);
EntityTypeSpawner.createSpawner("SeekerSmoke", CSeekerSmoke);
EntityTypeSpawner.createSpawner("HadronRailGun", CHadronRailGun);
EntityTypeSpawner.createSpawner("HadronParticleLine", CHadronParticleLine);

export default EntityTypeSpawner;