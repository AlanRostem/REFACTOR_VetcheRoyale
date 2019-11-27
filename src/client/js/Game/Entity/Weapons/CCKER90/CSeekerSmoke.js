import CEntity from "../../CEntity.js";
import OtherPlayer from "../../Player/OtherPlayer.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../../Graphics/Renderer.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import CProjectile from "../../CProjectile.js";
import Timer from "../../../../../../shared/code/Tools/CTimer.js";

let enemySprite = new SpriteSheet("detectedEnemy");
enemySprite.bind("red", 0, 0, 16 * 16, 16);
enemySprite.setCentralOffset(4);

class CSeekerSmoke extends CProjectile {

    constructor(data) {
        super(data);
        this.smoke = {};
        this.enemiesInSmoke = {};
        this.smokePlace = false;
        this.canPlaySound = true;
        this.timer = new Timer(0.1, () => {this.canPlaySound = true;}, true);

    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        let self = this.output;
        this.smoke.x = self.pos.x - self.smokeBounds.x;
        this.smoke.y = self.pos.y - self.smokeBounds.y;
        this.smoke.w = self.smokeBounds.x * 2;
        this.smoke.h = self.smokeBounds.y * 2;
        this.enemiesInSmoke = {};
        if (self.findPlayers) {
            if (!this.smokePlace && (this.smokePlace = true)) this.smokeSound = AudioPool.play("Weapons/cker90_super.oggSE");
            else if(this.smokeSound) this.smokeSound.updatePanPos(this.output.pos);
            for (let entity of Scene.entityManager.container.values()) {
                if (this.isEnemyInSmoke(entity)) {
                    this.enemiesInSmoke[entity.output.id] = entity;
                }
            }
        }

        this.timer.tick(deltaTime);
        if(self.taps && this.canPlaySound && !(this.canPlaySound = false)) AudioPool.play("Weapons/cker90_superBounce.oggSE").updatePanPos(this.output.pos);


    }

    isTeammate(player) {
        let owner = Scene.entityManager.getEntityByID(this.output.ownerID);
        if (owner && player) return owner.output.teamID === player.output.teamID;
        return false;
    }

    isEnemyInSmoke(player) {
        return player.output.pos.y + player.height > this.smoke.y
            && player.output.pos.y < (this.smoke.y + this.smoke.h)
            && player.output.pos.x + player.width > this.smoke.x
            && player.output.pos.x < (this.smoke.x + this.smoke.w)
            && !this.isTeammate(player) && player instanceof OtherPlayer;
    }

    draw() {
        super.draw();
        let self = this.output;
        if (self.findPlayers) {
            R.drawRect("gray", this.smoke.x, this.smoke.y, this.smoke.w, this.smoke.h, true);
            if (Scene.clientRef.isReady()) {
                if (this.isTeammate(Scene.clientRef.player)) {
                    for (let id in this.enemiesInSmoke) {
                        let enemy = this.enemiesInSmoke[id];
                        enemySprite.animateFrom("red", enemy.animations.getCurrentAnim(), 16, 16);
                        SpriteSheet.beginChanges();
                        if (enemy.movementState.direction === "left") {
                            enemySprite.flipX();
                        }
                        enemySprite.drawAnimated(
                            Math.round(enemy.output.pos.x) + R.camera.displayPos.x,
                            Math.round(enemy.output.pos.y) + R.camera.displayPos.y);
                        SpriteSheet.end();
                    }
                }
            }
        }
    }
}

export default CSeekerSmoke;