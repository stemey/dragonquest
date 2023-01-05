import { AbstractWorld } from "./AbstractWorld";

export default class extends AbstractWorld {
    constructor() {
        super({ key: "CastleScene" });
    }

    create() {
        this.startWorld();
    }
}
