import { Events } from "phaser";
import { Unit } from "../../sprites/Unit";
import { Weapon } from "../types/Weapon";
import { BattleAction } from "./BattleAction";

export class Attack implements BattleAction {
    constructor(private weapon: Weapon) {}

    execute(events: Events.EventEmitter, actor: Unit, target: Unit) {
        const strength = Math.random() * 20;
        if (target.isHurt(this.weapon.strength + strength)) {
            const strength = Math.random() * 8;
            const totalDamage = Math.round(this.weapon.damage + strength);
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
