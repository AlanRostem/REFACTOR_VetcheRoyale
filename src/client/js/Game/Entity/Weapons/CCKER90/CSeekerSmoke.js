import CEntity from "../../CEntity.js";
import OtherPlayer from "../../Player/OtherPlayer.js";
import SpriteSheet from "../../../../AssetManager/Classes/Graphical/SpriteSheet.js";
import R from "../../../../Graphics/Renderer.js";
import AudioPool from "../../../../AssetManager/Classes/Audio/AudioPool.js";
import CProjectile from "../../CProjectile.js";
import Timer from "../../../../../../shared/code/Tools/CTimer.js";
import AssetManager from "../../../../AssetManager/AssetManager.js";
import Vector2D from "../../../../../../shared/code/Math/CVector2D.js";
import EffectManager from "../../../../Graphics/EffectManager.js";
import UserPlayer from "../../Player/UserPlayer.js";

let enemySprite = new SpriteSheet("detectedEnemy");
enemySprite.bind("red", 0, 0, 16 * 7, 16);
enemySprite.setCentralOffset(4);


let teamSprite = new SpriteSheet("detectedTeam");
teamSprite.bind("white", 0, 0, 16 * 7, 16);
teamSprite.setCentralOffset(4);

class CSeekerSmoke extends CProjectile {

    constructor(data) {
        super(data);
        this.smoke = {};
        this.enemiesInSmoke = {};
        this.teammatesInSmoke = {};
        this.smokePlace = false;
        this.canPlaySound = true;
        this.timer = new Timer(0.1, () => {
            this.canPlaySound = true;
        }, true);

        this.timer2 = new Timer(0.15, () => {
            this.addSmokeParticle = true;
        }, true);


        this.addSmokeParticle = false;

        this.animationSpec = new SpriteSheet.Animation(0, 3, 4, 0.09);
        this.animationSpecGrenade = new SpriteSheet.Animation(0, 7, 8, 0.1);

    }

    update(deltaTime, client) {
        super.update(deltaTime, client);
        let self = this.output;
        this.smoke.x = self.pos.x - self.smokeBounds.x;
        this.smoke.y = self.pos.y - self.smokeBounds.y;
        this.smoke.w = self.smokeBounds.x * 2;
        this.smoke.h = self.smokeBounds.y * 2;
        this.enemiesInSmoke = {};
        this.teammatesInSmoke = {};
        if (self.findPlayers) {
            if (!this.smokePlace && (this.smokePlace = true)) this.smokeSound = AudioPool.play("Weapons/cker90_super.oggSE");
            else if (this.smokeSound) this.smokeSound.updatePanPos(this.output.pos);

            for (let entity of Scene.entityManager.container.values()) {
                if (this.isEnemyInSmoke(entity)) {
                    this.enemiesInSmoke[entity.output.id] = entity;
                }
            }

            for (let entity of Scene.entityManager.container.values()) {
                if (this.isTeammateInSmoke(entity)) {
                    this.teammatesInSmoke[entity.output.id] = entity;
                }
            }
        }

        this.timer.tick(deltaTime);
        this.timer2.tick(deltaTime);

        let minSpeed = 60;

        if (self.taps && this.canPlaySound && (Math.abs(this.output.vel.y) > 4 || Math.abs(this.output.vel.x) >= minSpeed)&& !(this.canPlaySound = false))
        {
            AudioPool.play("Weapons/cker90_superBounce.oggSE").updatePanPos(this.output.pos);
          //  this.timer._maxTime = Number(0.2.toFixed(4));
        }
        else if (self.taps && this.canPlaySound && (Math.abs(this.output.vel.y) <= 4 && Math.abs(this.output.vel.x) < minSpeed)&& !(this.canPlaySound = false))
        {
            AudioPool.play("Weapons/cker90_superGlide.oggSE").updatePanPos(this.output.pos);
         //   this.timer._maxTime = Number(0.5.toFixed(4));
        }

        this.animationSpecGrenade.frameSpeed = (Math.abs(this.output.vel.y) > minSpeed || Math.abs(this.output.vel.x) > minSpeed) ? 0.1 : 0.5;

      /*  this.timer._maxTime = Number(this.animationSpecGrenade.frameSpeed.toFixed(4));
        this.timer.reset();*/

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

    isTeammateInSmoke(player) {
        return player.output.pos.y + player.height > this.smoke.y
            && player.output.pos.y < (this.smoke.y + this.smoke.h)
            && player.output.pos.x + player.width > this.smoke.x
            && player.output.pos.x < (this.smoke.x + this.smoke.w)
            && this.isTeammate(player)/* && player instanceof UserPlayer*/;
    }

    draw() {
        //super.draw();
        let self = this.output;


        CSeekerSmoke.grenadeAnimation.animate("C-KER .90_smokeGrenadeAnimation", this.animationSpecGrenade, 6, 6);

        CSeekerSmoke.grenadeAnimation.drawAnimated(
            this.output.pos.x + R.camera.x,
            this.output.pos.y + R.camera.y
        );
        /*
                R.drawCroppedImage(
                    AssetManager.getMapImage("C-KER .90_smokeGrenade"),
                    0,
                    0,
                    4,
                    6,
                    this.output.pos.x,
                    this.output.pos.y,
                    4,
                    6, true);*/

        if (this.addSmokeParticle && !self.findPlayers && !(this.addSmokeParticle = false) && (Math.abs(this.output.vel.y) > 20 || Math.abs(this.output.vel.x) > 20)) {
            EffectManager.createEffect(this.output.pos.x, this.output.pos.y, "CKERSmokeParticle", 0);
        }

        if (self.findPlayers) {

            CSeekerSmoke.smokeAnimation.animate("C-KER .90_smokeAnimation", this.animationSpec, 216, 136);

            CSeekerSmoke.smokeAnimation.drawAnimated(
                this.smoke.x - 8 + R.camera.x,
                this.smoke.y - 8 + R.camera.y
            );

            // R.drawRect("red", this.smoke.x, this.smoke.y, this.smoke.w, this.smoke.h, true);


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

                    for (let id in this.teammatesInSmoke) {
                        let team = this.teammatesInSmoke[id];
                        teamSprite.animateFrom("white", team.animations.getCurrentAnim(), 16, 16);
                        SpriteSheet.beginChanges();
                        if (team.movementState.direction === "left") {
                            teamSprite.flipX();
                        }
                        teamSprite.drawAnimated(
                            Math.round(team.output.pos.x) + R.camera.displayPos.x,
                            Math.round(team.output.pos.y) + R.camera.displayPos.y);
                        SpriteSheet.end();
                    }
                }
            }
        }
    }
}

export default CSeekerSmoke;

AssetManager.addSpriteCreationCallback(() => {

    let canvas = document.createElement("canvas");

    canvas.width = 216 * 4;
    canvas.height = 136;

    let ctx = canvas.getContext('2d');

    let drawSmoke = new Array(12 * 20);
    for (let d = 0; d < drawSmoke.length; d++) drawSmoke[d] = new Vector2D(0, 0);

    for (let frames = 0; frames < 4; frames++) {

        let visitSmoke = new Array(12);
        for (let i = 0; i < 12; i++) visitSmoke[i] = new Array(20).fill(0);

        let countSmoke = 12 * 20;
        let counter = 0;

        if (!frames) {
            while (countSmoke) {

                let i = Math.random() * 12 | 0;
                let j = Math.random() * 20 | 0;

                if (!visitSmoke[i][j]) {
                    visitSmoke[i][j] = 1;
                    countSmoke--;
                    drawSmoke[counter].x = j;
                    drawSmoke[counter].y = i;
                    counter++;
                }
            }
        }

        for (var i = 0; i < drawSmoke.length; i++) {
            ctx.drawImage(
                AssetManager.getMapImage("C-KER .90_smokeEffect"),
                frames * 26, 0, 26, 26,
                drawSmoke[i].x * 10 + frames * 216,
                drawSmoke[i].y * 10,
                26, 26
            );
        }
    }

    AssetManager.setMapImage("C-KER .90_smokeAnimation", canvas);

    CSeekerSmoke.smokeAnimation = new SpriteSheet("C-KER .90_smokeAnimation");
    CSeekerSmoke.smokeAnimation.bind("C-KER .90_smokeAnimation", 0, 0, 216, 136);

    CSeekerSmoke.grenadeAnimation = new SpriteSheet("C-KER .90_smokeGrenadeAnimation");
    CSeekerSmoke.grenadeAnimation.bind("C-KER .90_smokeGrenadeAnimation", 0, 0, 6, 6);


    EffectManager.configureEffect("CKERSmokeParticle", 144, 0, 5, 5, 6, 0.08);

});
