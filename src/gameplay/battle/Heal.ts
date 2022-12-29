import { Events } from "phaser";
import { Unit } from "../../sprites/Unit";
import { Healing } from "../types/Healing";
import { BattleAction } from "./BattleAction";

export  class Heal implements BattleAction {
    constructor(private heal: Healing) {
    }

    execute(events: Events.EventEmitter, actor: Unit, target: Unit) {
        target.heal(this.heal.healing);
        events.emit("Message", actor.name + "heals " + target.name);
    }

    get description() {
        return this.heal.name + " " + this.heal.healing;
    }
}
