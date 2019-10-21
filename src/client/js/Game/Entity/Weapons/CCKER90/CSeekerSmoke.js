import CEntity from "../../CEntity.js";

class CSeekerSmoke extends CEntity {
    draw() {
        super.draw();
        let self = this.output;
        if (self.findPlayers) {
            R.drawRect("gray",
                self.pos.x - self.smokeBounds.x,
                self.pos.y - self.smokeBounds.y,
                self.smokeBounds.x * 2,
                self.smokeBounds.y * 2, true);
        }
    }
}

export default CSeekerSmoke;