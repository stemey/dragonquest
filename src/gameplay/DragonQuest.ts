import { IObservableArray, IObservableValue, observable } from "mobx";
import { DropItem } from "./types/DropItem";
import { Unit } from "../sprites/Unit";
import { Level } from "./types/Level";
import { Characters } from "./types/Characters";
import { Powers } from "./types/Powers";
import { DropItemRef } from "./types/DropItemRef";
import { CustomApi } from "./CustomApi";
import { Attack } from "./battle/Attack";
import { Heal } from "./battle/Heal";
import { BattleOutcome, GameState, LevelState } from "./GameState";

interface Coordinate {
    x: number;
    y: number;
}

class PlayerState {
    scene: string = "";
    path: Coordinate[] = [];
    update(scene: string, x: number, y: number) {
        if (scene !== this.scene) {
            this.path = [];
            this.scene = scene;
        }
        const c = { x: Math.round(x), y: Math.round(y) };
        if (
            this.path.length === 0 ||
            (c.x !== this.path[0].x && c.y !== this.path[0].y)
        ) {
            this.path.splice(0, 0, c);
            while (this.path.length > 40) {
                this.path.pop();
            }
        }
    }
    getLastSafePlayerPosition() {
        const index = Math.min(10, this.path.length);
        return this.path[index];
    }
}

export class DragonQuestType {
    goldCount: IObservableValue<number> = observable.box(0);
    items: IObservableArray<DropItem> = observable.array([]);
    private levels: { [key: string]: Level } = {};
    public currentLevelKey = "";
    public heroes: Unit[] = [];
    private characters: Characters = {};
    private powers: Powers = {};
    public api = new CustomApi(this);
    private gameState = new GameState();
    public playerState: PlayerState = new PlayerState();
    private levelEmitter?: Phaser.Events.EventEmitter;

    init(characters: Characters, powers: Powers) {
        this.characters = characters;
        this.powers = powers;
        this.heroes = []; //Object.values(this.characters).filter(c => c.hero).map(h => new Unit(h))
    }

    createVillainByName(name: string) {
        return new Unit(this.characters[name]);
    }
    updateLevelFlags(flags: { [key: string]: boolean }) {
        this.gameState.updateLevelFlags(flags);
        this.onChanged();
    }

    getLastSafePlayerPosition() {
        return this.playerState.getLastSafePlayerPosition();
    }

    createVillains(name: string) {
        const monsterIds = this.currentLevel.monsters[name];
        return monsterIds
            .map((id) => this.characters[id])
            .filter((c) => !!c)
            .map((c) => new Unit(c));
    }

    public updatePlayerPosition(scene: string, x: number, y: number) {
        this.playerState?.update(scene, x, y);
    }

    private get currentLevel() {
        return this.levels[this.currentLevelKey];
    }
    getLoot(lootName: any): DropItemRef[] {
        return this.currentLevel.loots[lootName];
    }
    getDialog(name: string) {
        return this.currentLevel.dialogs[name];
    }

    setLevel(
        key: string,
        level: Level,
        levelEmitter: Phaser.Events.EventEmitter
    ) {
        this.levels[key] = level;
        this.gameState.enterLevel(key);
        this.levelEmitter = levelEmitter;
    }

    foundGold(goldCount: number) {
        this.goldCount.set(this.goldCount.get() + goldCount);
        console.log("gold " + this.goldCount);
        this.onChanged();
    }

    foundItems(itemRefs: DropItemRef[]) {
        // TODO number not taken into account especially for gold
        itemRefs.forEach((itemRef) => {
            if (itemRef.type === "gold") {
                this.foundGold(itemRef.amount);
            } else if (itemRef.type === "power") {
                const power = this.powers[itemRef.name];
                // TODO cannot add multiple potions. Which hero to add weapon to
                if (power.type === "healing") {
                    this.heroes[0].attacks.push(new Heal(power));
                } else {
                    this.heroes[0].attacks.push(new Attack(power));
                }
                const item = this.powers[itemRef.name];
                if (item) {
                    this.items.push(item);
                }
            } else if (itemRef.type === "key") {
                this.items.push(itemRef);
            }
        });
        this.onChanged();
    }

    foundFood(foodCount: number) {
        const foodShare = foodCount / Object.keys(this.heroes).length;
        Object.values(this.heroes).forEach((hero) => {
            hero.foundFood(foodShare);
        });
        this.onChanged();
    }

    logInventory() {
        Array.from(this.items.values()).forEach((item) => {
            console.log(item.type);
        });
    }

    addHero(name: string) {
        const hero = this.characters[name];
        this.heroes.push(new Unit(hero));
        this.onChanged();
    }

    onChanged() {
        Object.keys(this.currentLevel.events).forEach((name) => {
            const event = this.currentLevel.events[name];
            if (
                this.gameState.currentLevel.firedEvents.indexOf(name) < 0 &&
                matches(this.gameState.currentLevel, event.trigger.levelState)
            ) {
                this.gameState.currentLevel.firedEvents.push(name);
                this.levelEmitter?.emit("DialogStart", event.dialog);
            }
        });
    }
    finishedBattle(outcome: BattleOutcome) {
        this.gameState.finishedBattle(outcome);
        this.onChanged();
    }
}

export function matches(level: LevelState, trigger: Partial<LevelState>) {
    let matches = true;
    const flags = trigger.flags;
    if (flags) {
        matches =
            matches &&
            Object.keys(flags).every(
                (key) => key in level.flags && flags[key] === level.flags[key]
            );
    }
    const monsters = trigger.monsters;
    if (monsters) {
        matches =
            matches &&
            Object.keys(monsters).every(
                (key) =>
                    key in level.monsters &&
                    monsters[key]?.dead === level.monsters[key]?.dead
            );
    }
    const dialogs = trigger.dialogs;
    if (dialogs) {
        matches =
            matches &&
            Object.keys(dialogs).every(
                (key) =>
                    key in level.dialogs &&
                    dialogs[key]?.finished === level.dialogs[key]?.finished
            );
    }
    return matches;
}

export const DragonQuest = new DragonQuestType();
(window as any).DragonQuest = DragonQuest;
