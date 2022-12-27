import { BattleAction } from "../gameplay/battle/BattleAction";
import { Power } from "../gameplay/character/Power";
import {Menu} from "./Menu";

export class ActionsMenu extends Menu {
    confirm() {
        this.scene.events.emit("ActionSelect", this.menuItemIndex);
    }

    initialize(attacks: BattleAction[]) {
        this.clear();
        for (let i = 0; i < attacks.length; i++) {
            const attack = attacks[i];
            this.addMenuItem(attack.description);
        }
    }
}
