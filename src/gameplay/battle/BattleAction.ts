import { Events } from "phaser";
import { Unit } from "../../sprites/Unit";

export interface BattleAction {
    execute(events: Events.EventEmitter, actor:Unit, target:Unit): void;
    description:string;
    name:string;
}
