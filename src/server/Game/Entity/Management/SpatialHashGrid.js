/**
 * Grid data structure that stores AABB's in cells at their respective locations.
 * It is used to reduce the collision lookup time complexity. Each cell is a hash set.
 */
class SpatialHashGrid {
    /**
     * @param spaceWidth {int} Horizontal boundary of the entire space
     * @param spaceHeight {int} Vertical boundary of the entire space
     * @param cellWidth {int} Horizontal boundary of each cell
     * @param cellHeight {int} Vertical boundary of each cell
     */
    constructor(spaceWidth, spaceHeight, cellWidth, cellHeight) {
        while (spaceWidth % cellWidth !== 0) {
            cellWidth++;
        }
        this.cols = spaceWidth / cellWidth;
        this.spaceWidth = spaceWidth;
        this.cellWidth = cellWidth;

        while (spaceHeight % cellHeight !== 0) {
            cellHeight++;
        }
        this.rows = spaceHeight / cellHeight;
        this.spaceHeight = spaceHeight;
        this.cellHeight = cellHeight;
        this.cellContainer = new Map();
    }

    /**
     * Returns a column index of the given position based on the hash-grid's configurations.
     * @param number {number} Horizontal position in cartesian space
     * @returns {int}
     */
    cellifyX(number) {
        let result = (number / this.cellWidth) | 0;
        if (result > this.cols) {
            result = this.cols;
        }
        if (result < 0) {
            result = 0;
        }
        return result;
    }

    /**
     * Returns a row index of the given position based on the hash-grid's configurations.
     * @param number {number} Vertical position in cartesian space
     * @returns {int}
     */
    cellifyY(number) {
        let result = (number / this.cellHeight) | 0;
        if (result > this.rows) {
            result = this.rows;
        }
        if (result < 0) {
            result = 0;
        }
        return result;
    }

    /**
     * Return the index of a given cell position
     * @param x {int} Column index
     * @param y {int} Row index
     * @returns {int}
     */
    indexAt(x, y) {
        return y * this.cols + x;
    }

    /**
     * Inserts an entity to a cell in the grid based on its cartesian coordinates
     * @param {Entity} entity Given entity to be inserted.
     */
    insert(entity) {
        let cx = this.cellifyX(entity.pos.x + entity.width / 2);
        let cy = this.cellifyY(entity.pos.y + entity.height / 2);
        let index = this.indexAt(cx, cy);
        if (!this.cellContainer.has(index)) {
            let cell = new Set;
            this.cellContainer.set(index, cell);
            cell.add(entity);
        } else {
            this.cellContainer.get(index).add(entity);
        }
    }

    /**
     * Iterate through all cells within the collision boundary for a given entity and perform custom operations.
     * @param boundary {CollisionBoundary} AABB to be checked for
     * @param callback {function} Function called for each cell iteration
     */
    iterate(boundary, callback) {
        let cx = this.cellifyX(boundary.pos.x);
        let cy = this.cellifyY(boundary.pos.y);
        let xLen = this.cellifyX(boundary.pos.x + boundary.bounds.x);
        let yLen = this.cellifyY(boundary.pos.y + boundary.bounds.y);
        for (let x = cx; x <= xLen; x++) {
            for (let y = cy; y <= yLen; y++) {
                let index = this.indexAt(x, y);
                if (this.cellContainer.has(index)) {
                    let cell = this.cellContainer.get(index);
                    callback(cell);
                }
            }
        }
    }

    letEntityIterate(entity, entityManager, deltaTime) {
        let cx = this.cellifyX(entity.entitiesInProximity.collisionBoundary.pos.x);
        let cy = this.cellifyY(entity.entitiesInProximity.collisionBoundary.pos.y);
        let xLen = this.cellifyX(entity.entitiesInProximity.collisionBoundary.pos.x + entity.entitiesInProximity.collisionBoundary.bounds.x);
        let yLen = this.cellifyY(entity.entitiesInProximity.collisionBoundary.pos.y + entity.entitiesInProximity.collisionBoundary.bounds.y);
        for (let x = cx; x <= xLen; x++) {
            for (let y = cy; y <= yLen; y++) {
                let index = this.indexAt(x, y);
                if (this.cellContainer.has(index)) {
                    entity.entitiesInProximity.proximityCellTraversal(this.cellContainer.get(index), entityManager, deltaTime);
                }
            }
        }
    }

    updateCellPosition(entity) {
        let x0;
        let y0;

        if (entity.old) {
            x0 = this.cellifyX(entity.old.x + entity.width / 2);
            y0 = this.cellifyY(entity.old.y + entity.height / 2);
        } else {
            x0 = this.cellifyX(entity.pos.x + entity.width / 2);
            y0 = this.cellifyY(entity.pos.y + entity.height / 2);
        }

        let x1 = this.cellifyX(entity.pos.x + entity.width / 2);
        let y1 = this.cellifyY(entity.pos.y + entity.height / 2);

        let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        let dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
        let err = (dx > dy ? dx : -dy) / 2;

        let entityIdx = this.indexAt(this.cellifyX(entity.pos.x + entity.width / 2), this.cellifyY(entity.pos.y + entity.height / 2));
        if (!this.cellContainer.has(entityIdx)) {
            let cell = new Set;
            this.cellContainer.set(entityIdx, cell);
            cell.add(entity);
        } else {
            this.cellContainer.get(entityIdx).add(entity);
        }
        while (true) {
            let index = this.indexAt(x0, y0);
            if (entityIdx !== index)
                if (this.cellContainer.has(index)) {
                    this.cellContainer
                        .get(index)
                        .delete(entity);
                }

            if (x0 === x1 && y0 === y1) break;

            let e2 = err;
            if (e2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dy) {
                err += dx;
                y0 += sy;
            }
        }
    }

    remove(entity) {
        let cx = this.cellifyX(entity.pos.x + entity.width / 2);
        let cy = this.cellifyY(entity.pos.y + entity.height / 2);
        let index = this.indexAt(cx, cy);
        if (this.cellContainer.has(index)) {
            this.cellContainer.get(index).delete(entity);
        } else {
            console.log("Cell " + index + " didnt exist!");
        }
    }
}

module.exports = SpatialHashGrid;