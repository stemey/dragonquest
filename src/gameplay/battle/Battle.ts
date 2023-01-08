import * as Phaser from "phaser";
import CharacterDisplay from "./CharacterDisplay";
import { DragonQuest } from "../hub/DragonQuest";
import { Unit } from "../../sprites/Unit";
import { BattleAction } from "./BattleAction";
import { BattleEntry } from "../../scenes/WorldEntryParameter";

export default class extends Phaser.Scene {
    private entryWorld = "";
    private characterList: CharacterDisplay[] = [];
    private enemies: Unit[] = [];
    private heroes: Unit[] = [];
    private units: Unit[] = [];
    private index = -1;
    private selectedIndex = 0;
    private playersTurn = false;
    private enemyName = "";
    constructor() {
        super({ key: "BattleScene" });
    }

    create(data: { entryWorld: string; enemyName: string; enemies: Unit[] }) {
        this.entryWorld = data.entryWorld;
        this.enemyName = data.enemyName;
        // change the background to green
        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");

        // Run UI Scene at the same time
        this.scene.launch("UIScene");
        this.input.keyboard.on("keydown", this.onKeyInput, this);

        if (data.enemies) {
            this.addCharacters(data.enemies);
        }
        this.events.on("wake", this.wake, this);
    }

    addCharacters(enemies: Unit[]) {
        const scale = 2;
        DragonQuest.instance.gameManager.getHeroes().forEach((hero, idx) => {
            const knight = new CharacterDisplay(
                hero,
                this,
                scale * 250,
                scale * 50 + scale * 60 * idx
            );
            this.add.existing(knight);
            this.characterList.push(knight);
        });

        this.enemies = enemies;
        this.enemies.forEach((enemy, idx) => {
            const monsterEnemy = new CharacterDisplay(
                enemy,
                this,
                scale * 50,
                scale * 60 * idx + scale * 40
            );
            this.add.existing(monsterEnemy);
            this.characterList.push(monsterEnemy);
        });

        // array with heroes
        this.heroes = DragonQuest.instance.gameManager.getHeroes();
        // array with both parties, who will attack
        this.units = this.heroes.concat(this.enemies);

        this.index = -1;
        this.selectedIndex = 0;
        this.playersTurn = false;
    }

    wake(
        sys: any,
        data: { entryWorld: string; enemyName: string; enemies: Unit[] }
    ) {
        this.entryWorld = data.entryWorld;
        this.entryWorld = data.entryWorld;
        this.scene.wake("UIScene");
        this.characterList.forEach((child) => {
            child.destroy();
        });
        this.characterList = [];
        this.addCharacters(data.enemies);

        this.time.addEvent({
            delay: 10,
            callback: this.nextTurn,
            callbackScope: this,
        });
    }

    nextTurn() {
        const oldUnit = this.units[this.index];
        if (oldUnit) {
            this.events.emit("UnitSelected", { turnId: -1 });
        }
        if (this.enemies.filter((enemy) => enemy.alive).length === 0) {
            this.events.emit("Message", "Heroes win");
            DragonQuest.instance.gameState.finishedBattle({
                heroWin: true,
                deadEnemy: this.enemyName,
            });
            this.time.addEvent({
                delay: 3000,
                callback: this.goToWorld,
                callbackScope: this,
            });
        } else if (this.heroes.filter((hero) => hero.alive).length === 0) {
            this.events.emit("Message", "Villains win");
            this.time.addEvent({
                delay: 3000,
                callback: this.goToWorld,
                callbackScope: this,
            });
        } else {
            this.index++;
            // if there are no more units, we start again from the first one
            if (this.index >= this.units.length) {
                this.index = 0;
            }
            const currentUnit = this.units[this.index];
            if (currentUnit) {
                // if its player hero
                if (this.heroes.indexOf(currentUnit) >= 0) {
                    if (currentUnit.alive) {
                        this.events.emit("UnitSelected", {
                            turnId: currentUnit.id,
                        });
                        this.playersTurn = true;
                        this.selectedIndex = 0;
                        this.events.emit("UnitSelected", {
                            selectedId: this.selectedIndex,
                            selectedCharacter: this.units[this.selectedIndex],
                        });
                        this.events.emit(
                            "PlayerSelect",
                            this.index,
                            currentUnit
                        );
                    } else {
                        this.time.addEvent({
                            delay: 1,
                            callback: this.nextTurn,
                            callbackScope: this,
                        });
                    }
                } else {
                    // else if its enemy unit
                    this.playersTurn = false;
                    this.events.emit("UnitSelected", { selectedId: -1 });
                    // pick random hero
                    this.events.emit("UnitSelected", {
                        turnId: currentUnit.id,
                    });
                    let hero = null;
                    do {
                        var r = Math.floor(Math.random() * this.heroes.length);
                        // call the enemy"s attack function
                        hero = this.heroes[r];
                    } while (!hero.alive);
                    const villain = currentUnit;
                    if (villain.alive) {
                        this.attack(villain, hero, villain.attacks[0]);
                        // add timer for the next turn, so will have smooth gameplay
                        this.time.addEvent({
                            delay: 3000,
                            callback: this.nextTurn,
                            callbackScope: this,
                        });
                    } else {
                        this.time.addEvent({
                            delay: 10,
                            callback: this.nextTurn,
                            callbackScope: this,
                        });
                    }
                }
            }
        }
    }

    // when the player have selected the enemy to be attacked
    receivePlayerSelection(action: any, actionIndex: number) {
        const attacker = this.units[this.index];
        const enemy = this.units[this.selectedIndex];
        const attack = attacker.attacks[actionIndex];
        this.attack(attacker, enemy, attack);

        // next turn in 3 seconds
        // this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this })
        this.time.addEvent({
            delay: 3000,
            callback: this.nextTurn,
            callbackScope: this,
        });
    }

    attack(attacker: Unit, opponent: Unit, attack: BattleAction) {
        attack.execute(this.events, attacker, opponent);
        this.events.emit("ActionFinished");
    }

    goToWorld() {
        this.scene.sleep("BattleScene");
        this.scene.sleep("UIScene");
        const deadEnemies = this.enemies.filter((enemy) => !enemy.alive);
        deadEnemies.forEach((enemy) => {
            if (enemy.dropItems) {
                DragonQuest.instance.inventory.foundItems(enemy.dropItems);
            }
        });
        const win = deadEnemies.length == this.enemies.length;
        DragonQuest.instance.events.battle.end.emit({
            heroWin: win,
            deadEnemy: this.enemyName,
        });
        this.scene.wake(this.entryWorld, {
            type: "battle",
            win,
        } as BattleEntry);
    }

    onKeyInput(event: KeyboardEvent) {
        if (this.playersTurn) {
            if (event.code === "ArrowLeft") {
                do {
                    this.selectedIndex--;
                    if (this.selectedIndex < 0) {
                        this.selectedIndex = this.units.length - 1;
                    }
                } while (!this.units[this.selectedIndex].alive);
                this.events.emit("UnitSelected", {
                    selectedId: this.units[this.selectedIndex].id,
                    selectedCharacter: this.units[this.selectedIndex],
                });
            } else if (event.code === "ArrowRight") {
                do {
                    this.selectedIndex++;
                    if (this.selectedIndex >= this.units.length) {
                        this.selectedIndex = 0;
                    }
                } while (!this.units[this.selectedIndex].alive);
                this.events.emit("UnitSelected", {
                    selectedId: this.units[this.selectedIndex].id,
                    selectedCharacter: this.units[this.selectedIndex],
                });
            }
        }
    }
}
