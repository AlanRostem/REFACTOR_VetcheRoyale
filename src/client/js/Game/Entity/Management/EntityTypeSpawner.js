import CEntity from "../CEntity.js";
import CPlayer from "../Player/CPlayer.js";

// Creates client versions of inbound entity data
const EntityTypeSpawner = {
    _functions: {},
    createSpawner(name, classType) {
        EntityTypeSpawner._functions[name] = data => {
            return new classType(data);
        }
    },
    spawn(name, data) {
        if (!EntityTypeSpawner._functions[name]) {
            console.warn("Entity with name " + name + " does not exist in the spawner.");
            return new CEntity(data);
        }
        return EntityTypeSpawner._functions[name](data);
    }
};


EntityTypeSpawner.createSpawner("Player", CPlayer);
EntityTypeSpawner.createSpawner("SEntity", CEntity);

export default EntityTypeSpawner;