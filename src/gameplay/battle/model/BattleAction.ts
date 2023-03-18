import { Events } from "phaser";
import { Unit } from "../../../sprites/Unit";
import { MessageManager } from "../../MessageManager";

export interface BattleAction {
    execute(messageManager:MessageManager, actor: Unit, target: Unit): void;
    description: string;
    name: string;
}
