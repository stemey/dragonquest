import { Events } from "phaser";
import { Unit } from "../../sprites/Unit";
import { Weapon } from "../types/Weapon";
import { BattleAction } from "./model/BattleAction";

export class Attack implements BattleAction {
    constructor(private weapon: Weapon) {}

    get name() {
        return this.weapon.name;
    }

    execute(
        events: Events.EventEmitter,
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
            if (!target.alive) {
                events.emit("Message", target.name + " is unable to battle");
            } else {
                events.emit(
                    "Message",
                    actor.name +
                        " attacks " +
                        target.name +
                        " for " +
                        totalDamage +
                        " damage"
                );
            }
        } else {
            events.emit("Message", actor.name + "'s attacks was futile");
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
