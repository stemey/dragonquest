import { AbstractWorld } from "./AbstractWorld";

export default class extends AbstractWorld {
    constructor() {
        super({ key: "/level/road", physics: { matter: {}, arcade: {} } });
    }

    create() {
        this.startWorld();
    }
}
