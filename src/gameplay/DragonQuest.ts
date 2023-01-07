import { Unit } from "../sprites/Unit";
import { Level } from "./types/Level";
import { Characters } from "./types/Characters";
import { Powers } from "./types/Powers";
import { DropItemRef } from "./types/DropItemRef";
import { CustomApi } from "./CustomApi";
import { Attack } from "./battle/Attack";
import { Heal } from "./battle/Heal";
import { BattleOutcome, GameState, LevelState } from "./GameState";
import { ConditionalDropItemRef } from "./types/ConditionalDropItemRef";
import { AnyDropItemRef } from "./types/AnyDropItemRef";
import { PlayerState } from "./types/PlayerState";
import { evaluateExpression } from "./evaluateExpression";
import { Inventory } from "./Inventory";
import { Store } from "../store/Store";

interface Coordinate {
    x: number;
    y: number;
}

class PlayerProgress {
    scene: string = "";
    path: Coordinate[] = [];

    get x() {
        return this.path[0].x;
    }
    get y() {
        return this.path[0].y;
    }
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
    async loadLastStorePoint() {
        const storePoints = await this.list();
        if (storePoints.length == 0) {
            return;
        }
        await this.load(storePoints[storePoints.length - 1].id);
    }
    matchesLevelState(levelState: Partial<LevelState>) {
        return matches(this.gameState.currentLevel, levelState);
    }
    hasItem(name: string): unknown {
        return this.inventory.hasItem(name);
    }
    public inventory = new Inventory();
    private levels: { [key: string]: Level } = {};
    public currentLevelKey = "";
    public heroes: Unit[] = [];
    private characters: Characters = {};
    private powers: Powers = {};
    public api = new CustomApi(this);
    private gameState = new GameState();
    public playerState: PlayerProgress = new PlayerProgress();
    private levelEmitter?: Phaser.Events.EventEmitter;
    private store = new Store();
    public loadedStorePoint?: number;

    init(characters: Characters, powers: Powers) {
        this.characters = characters;
        this.powers = powers;
        this.heroes = []; //Object.values(this.characters).filter(c => c.hero).map(h => new Unit(h))
    }

    getPlayerState() {
        const className = this.heroes[0].className;
        return {
            className,
            level: 1,
        } as PlayerState;
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
    getLoot(lootName: any): (ConditionalDropItemRef | DropItemRef)[] {
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
        this.inventory.foundGold(goldCount);
        this.onChanged();
    }

    foundItems(anyItemRefs: AnyDropItemRef[]) {
        // TODO number not taken into account especially for gold
        const itemRefs = anyItemRefs.reduce((refs, ref) => {
            if ("condition" in ref) {
                if (evaluateExpression(ref.condition)) {
                    refs = refs.concat(ref.dropItemRefs);
                }
            } else {
                refs.push(ref);
            }

            return refs;
        }, [] as DropItemRef[]);
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
                    this.inventory.addItem(item);
                }
            } else if (itemRef.type === "key") {
                this.inventory.addItem(itemRef);
            }
        });
        this.onChanged();
        return itemRefs;
    }

    foundFood(foodCount: number) {
        const foodShare = foodCount / Object.keys(this.heroes).length;
        Object.values(this.heroes).forEach((hero) => {
            hero.foundFood(foodShare);
        });
        this.onChanged();
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

    finishedDialog(dialog: string) {
        this.gameState.finishedDialog(dialog);
        this.onChanged();
    }

    async autoSave() {
        this.save();
    }

    async save(name?: string) {
        const spName =
            name ||
            this.gameState.levelKey +
                " " +
                new Date().toLocaleDateString() +
                " " +
                new Date().toLocaleTimeString();
        await this.store.store({
            game: this.gameState.serialize(),
            inventory: this.inventory.serialize(),
            player: { x: this.playerState.x, y: this.playerState.y },
            date: Date.now(),
            name: spName,
        });
    }

    async list() {
        return await this.store.list();
    }
    async load(id: number) {
        this.loadedStorePoint = id;
        const storePoint = await this.store.load(id);
        const { x, y } = storePoint.player;
        this.inventory.deserialize(storePoint.inventory);
        this.gameState.deserialize(storePoint.game);
        this.levelEmitter?.emit("LoadGame", {
            scene: this.gameState.levelKey,
            x,
            y,
        });
    }

    addActionState(type: string, data: any) {
        this.gameState.addActionState(type, data);
    }
    getActionStates(type: string) {
        return this.gameState.getActionStates(type);
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
