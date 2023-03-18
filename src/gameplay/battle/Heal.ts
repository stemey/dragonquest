import { Events } from "phaser";
import { Unit } from "../../sprites/Unit";
import { MessageManager } from "../MessageManager";
import { Healing } from "../types/Healing";
import { BattleAction } from "./model/BattleAction";
import { Target } from "./model/target";

export class Heal implements BattleAction {
    constructor(private heal: Healing) {}
    get name() {
        return this.heal.name;
    }

    public isSelectable(target: Target) {
        return !target.opponent;
    }

    execute(messageManager: MessageManager, actor: Unit, target: Unit) {
        target.heal(this.heal.healing);
        messageManager.displayMessage(actor.name + " heals " + target.name);
    }

    get description() {
        return this.heal.name + " " + this.heal.healing;
    }
}
