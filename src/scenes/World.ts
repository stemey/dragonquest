import {AbstractWorld} from "./AbstractWorld";

export default class extends AbstractWorld {
    constructor() {
        super({ key: "WorldScene" });
    }

    preload() {}

    create() {
        this.startWorld("map", 100, 100);
    }
}
