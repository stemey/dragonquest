import { AbstractWorld } from "./AbstractWorld";

export default class extends AbstractWorld {
    constructor() {
        super("WorldScene");
    }

    preload() {}

    create() {
        this.startWorld();
    }
}
