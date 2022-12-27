import * as Phaser from "phaser";
import { ActionsMenu } from "../menu/ActionsMenu";
import Message from "../ui/Message";
import { CharacterStats } from "../menu/CharacterStats";
import Battle from "./Battle";
import { Unit } from "../sprites/Unit";

export class UiScene extends Phaser.Scene {
    private graphics?: Phaser.GameObjects.Graphics;
    private currentMenu?: ActionsMenu;
    private actionsMenu?: ActionsMenu;
    private battleScene?: Battle;
    constructor() {
        super({ key: "UIScene" });
    }

    create() {
        const scale = 2;
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(
            scale * 2,
            scale * 150,
            scale * 150,
            scale * 100
        );
        this.graphics.fillRect(
            scale * 2,
            scale * 150,
            scale * 150,
            scale * 100
        );
        this.graphics.strokeRect(
            scale * 155,
            scale * 150,
            scale * 165,
            scale * 100
        );
        this.graphics.fillRect(
            scale * 155,
            scale * 150,
            scale * 165,
            scale * 100
        );

        // basic container to hold all menus
        const menus = this.add.container();

        const battleScene = this.scene.get("BattleScene");
        this.battleScene = battleScene as Battle;

        const heroesMenu = new CharacterStats(scale * 160, scale * 153, this);
        const actionsMenu = new ActionsMenu(scale * 5, scale * 153, this, []);

        // the currently selected menu
        this.currentMenu = actionsMenu;
        this.actionsMenu = actionsMenu;

        // add menus to the container
        menus.add(heroesMenu);
        menus.add(actionsMenu);

        this.input.keyboard.on("keydown", this.onKeyInput, this);

        battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);
        battleScene.events.on(
            "UnitSelected",
            heroesMenu.characterSelected,
            heroesMenu
        );

        const message = new Message(this, battleScene.events);
        this.add.existing(message);

        // TODO should be in battleScene
        (battleScene as Battle).nextTurn();
    }

    attack() {
        const actionIndex = this.actionsMenu?.menuItemIndex;
        if (typeof actionIndex === "undefined") {
            return;
        }
        this.actionsMenu?.deselect();
        this.currentMenu = undefined;
        this.battleScene?.receivePlayerSelection("attack", actionIndex);
    }

    onPlayerSelect(id: number, character: Unit) {
        this.actionsMenu?.initialize(character.attacks);
        this.actionsMenu?.select(0);
        this.currentMenu = this.actionsMenu;
    }

    onKeyInput(event: KeyboardEvent) {
        if (this.currentMenu) {
            if (event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if (event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if (event.code === "Space") {
                this.attack();
            }
        }
    }
}
