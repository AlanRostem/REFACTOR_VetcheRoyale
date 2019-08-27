import CEntity from "../CEntity.js";
import RemotePlayer from "../Player/RemotePlayer.js";
import UserPlayer from "../Player/UserPlayer.js";
import CWeapon from "../Weapons/CWeapon.js";
import CBottle from "../CBottle.js";
import CPortal from "../CPortal.js";
import CKE_6H from "../Weapons/CKE_6H.js";


// Creates client versions of inbound entity data
const EntityTypeSpawner = {
    _functions: {},
    createSpawner(name, classType) {
        EntityTypeSpawner._functions[name] = data => {
            return new classType(data);
        }
    },
    spawn(name, data, client) {
        if (!EntityTypeSpawner._functions[name]) {
            console.warn("Entity with name " + name + " does not exist in the spawner.");
            return new CEntity(data);
        }
        if (client.id === data._id)
            return new UserPlayer(data);

        return EntityTypeSpawner._functions[name](data);
    }
};


EntityTypeSpawner.createSpawner("Player", RemotePlayer);
EntityTypeSpawner.createSpawner("SEntity", CEntity);

EntityTypeSpawner.createSpawner("Bottle", CBottle);
EntityTypeSpawner.createSpawner("Portal", CPortal);

EntityTypeSpawner.createSpawner("AttackWeapon", CWeapon);
EntityTypeSpawner.createSpawner("BIGMotorizer", CWeapon);
EntityTypeSpawner.createSpawner("KE_6H", CKE_6H);

export default EntityTypeSpawner;