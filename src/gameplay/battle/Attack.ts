import { Events } from "phaser";
import { Unit } from "../../sprites/Unit";
import { MessageManager } from "../MessageManager";
import { Weapon } from "../types/Weapon";
import { BattleAction } from "./model/BattleAction";
import { Target } from "./model/target";

export class Attack implements BattleAction {
    constructor(private weapon: Weapon) {}

    get name() {
        return this.weapon.name;
    }

    public isSelectable(target: Target) {
        return target.opponent;
    }

    execute(
        messageManager: MessageManager,
        actor: Unit,
        target: Unit,
        random = true
    ) {
        const extraStrength = random
            ? ((Math.random() - 0.5) * this.weapon.strength) / 4
            : 0;
        if (target.isHurt(this.weapon.strength + extraStrength)) {
            const extraDamage = random
                ? ((Math.random() - 0.5) * this.weapon.damage) / 4
                : 0;
            const totalDamage = Math.round(this.weapon.damage + extraDamage);
            target.takeDamage(totalDamage);
            actor.actionPerformed(true, this.weapon.name);
            messageManager.displayMessage(
                actor.name +
                    " attacks " +
                    target.name +
                    " for " +
                    totalDamage +
                    " damage"
            );
            if (!target.alive) {
                messageManager.displayMessage(`${target.name} is dead`);
            }
        } else {
            messageManager.displayMessage(actor.name + "'s attacks was futile");
        }
    }

    get description() {
        return (
            this.weapon.name +
            " " +
            this.weapon.strength +
            "/" +
            this.weapon.damage
        );
    }
}
