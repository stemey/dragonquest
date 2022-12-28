import {AbstractWorld} from "./AbstractWorld";

export default class extends AbstractWorld {
    constructor() {
        super({ key: "RoadScene" });
    }

    preload() {}

    create() {

        this.startWorld("road", 100, 100);
    }
}
