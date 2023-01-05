import { AbstractWorld } from "./AbstractWorld";
import { GatewayEntry, WorldEntryParameter } from "./WorldEntryParameter";

export class GeneralLevel extends AbstractWorld {
    create(data?: GatewayEntry) {
        this.startWorld(data);
    }
}
