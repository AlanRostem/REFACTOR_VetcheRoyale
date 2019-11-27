import CEntity from "../../CEntity.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import CProjectile from "../../CProjectile.js";


class CMicroMissile extends CProjectile {
    onClientSpawn(dataPack, client) {
        super.onClientSpawn(dataPack, client);
        AudioPool.play("Weapons/motorizer_s.oggSE");
    }
}

export default CMicroMissile;