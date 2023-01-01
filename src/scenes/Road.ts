import { AbstractWorld } from "./AbstractWorld";

export default class extends AbstractWorld {
    constructor() {
        super({
            key: "/level/road",
        });
    }

    create() {
        this.startWorld("", 100, 100);
    }
}
