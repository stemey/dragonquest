import { Coordinate } from "./Coordinate";

export class PlayerProgress {
    scene: string = "";
    path: Coordinate[] = [];

    get x() {
        return this.path[0].x;
    }
    get y() {
        return this.path[0].y;
    }
    update(scene: string, x: number, y: number) {
        if (scene !== this.scene) {
            this.path = [];
            this.scene = scene;
        }
        const c = { x: Math.round(x), y: Math.round(y) };
        if (
            this.path.length === 0 ||
            (c.x !== this.path[0].x && c.y !== this.path[0].y)
        ) {
            this.path.splice(0, 0, c);
            while (this.path.length > 40) {
                this.path.pop();
            }
        }
    }
    getLastSafePlayerPosition() {
        const index = Math.min(10, this.path.length);
        return this.path[index];
    }
}
