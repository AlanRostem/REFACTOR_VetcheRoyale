import CEntity from "../../CEntity.js";
import OtherPlayer from "../../Player/OtherPlayer.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../../Graphics/Renderer.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import CProjectile from "../../CProjectile.js";
import Timer from "../../../../../../shared/code/Tools/CTimer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import Vector2D from "../../../../../../shared/code/Math/CVector2D.js";

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
        this.timer = new Timer(0.1, () => {
            this.canPlaySound = true;
        }, true);

        this.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.09);

        this.visitSmoke = new Array(12);
        for (var i = 0; i < 12; i++) this.visitSmoke[i] = new Array(20).fill(0);

        this.countSmoke = 12 * 20;
        this.smokeUpdateCells = true;

        this.drawSmoke = new Array(12*20);
        for(var d = 0; d<this.drawSmoke.length; d++) this.drawSmoke[d] = new Vector2D(0,0);
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
            else if (this.smokeSound) this.smokeSound.updatePanPos(this.output.pos);
            for (let entity of Scene.entityManager.container.values()) {
                if (this.isEnemyInSmoke(entity)) {
                    this.enemiesInSmoke[entity.output.id] = entity;
                }
            }
        }

        this.timer.tick(deltaTime);
        if (self.taps && this.canPlaySound && !(this.canPlaySound = false)) AudioPool.play("Weapons/cker90_superBounce.oggSE").updatePanPos(this.output.pos);

        CSeekerSmoke.smokeAnimation.animate("C-KER .90_smokeEffect", this.animationSpec, 26, 26);

        var counter = 0;

        while (this.countSmoke && this.smokeUpdateCells && !(this.animationSpec.currentCol === this.animationSpec.endCol)) {

            var i = Math.random() * 12 | 0;
            var j = Math.random() * 20 | 0;

            if (!this.visitSmoke[i][j]) {
                this.visitSmoke[i][j] = 1;
                this.countSmoke--;
                this.drawSmoke[counter].x = j;
                this.drawSmoke[counter].y = i;
                counter++;
            }
        }

       /* if(this.animationSpec.currentCol === this.animationSpec.endCol) {
            this.smokeUpdateCells = true;

            this.visitSmoke = new Array(12);
            for (var f = 0; f < 12; f++) this.visitSmoke[f] = new Array(20).fill(0);
            this.countSmoke = 12 * 20;
        }
        else this.smokeUpdateCells = false;*/

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
        //super.draw();
        let self = this.output;

        R.drawCroppedImage(
            AssetManager.getMapImage("C-KER .90_smokeGrenade"),
            0,
            0,
            4,
            6,
            this.output.pos.x,
            this.output.pos.y,
            4,
            6, true);

        if (self.findPlayers) {
            //  R.drawRect("gray", this.smoke.x, this.smoke.y, this.smoke.w, this.smoke.h, true);



            for(var i = 0; i<this.drawSmoke.length; i++) {
                CSeekerSmoke.smokeAnimation.drawAnimated(
                    this.smoke.x + this.drawSmoke[i].x * 10 - 8 + R.camera.x,
                    this.smoke.y + this.drawSmoke[i].y * 10 - 8 + R.camera.y);
            }

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

AssetManager.addSpriteCreationCallback(() => {
    CSeekerSmoke.smokeAnimation = new SpriteSheet("C-KER .90_smokeEffect");
    CSeekerSmoke.smokeAnimation.bind("C-KER .90_smokeEffect", 0, 0, 104, 26);
});