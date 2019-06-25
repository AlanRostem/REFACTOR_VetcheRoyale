import CEntity from "../CEntity.js";
import CPlayer from "../Player/CPlayer.js";

export default class EntityTypeSpawner {
    static functions = {};


    static createSpawner(name, classType) {
        EntityTypeSpawner.functions[name] = data => {
            return new classType(data);
        }
    }

    static spawn(name, data) {
        if (!EntityTypeSpawner.functions[name]) {
            console.warn("Entity with name " + name + " does not exist in the spawner.");
            return new CEntity(data);
        }
        return EntityTypeSpawner.functions[name](data);
    }
}

EntityTypeSpawner.createSpawner("Player", CPlayer);
EntityTypeSpawner.createSpawner("Entity", CEntity);