import CEntity from "../../CEntity.js";
import SoundManager from "../../../../AssetManager/Classes/Audio/SoundManager.js";

class CMicroMissile extends CEntity {
    onClientSpawn(dataPack, client) {
        super.onClientSpawn(dataPack, client);
        SoundManager.play("Weapons/motorizer_s.oggSE");
    }
}

export default CMicroMissile;