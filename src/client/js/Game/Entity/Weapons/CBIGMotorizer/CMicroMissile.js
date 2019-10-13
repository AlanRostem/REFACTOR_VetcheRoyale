import CEntity from "../../CEntity.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";

class CMicroMissile extends CEntity {
    onClientSpawn(dataPack, client) {
        super.onClientSpawn(dataPack, client);
        AudioPool.play("Weapons/motorizer_s.oggSE");
    }
}

export default CMicroMissile;