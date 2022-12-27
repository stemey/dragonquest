import * as Phaser from "phaser";
import { Unit } from "../sprites/Unit";
import MenuItem from "./MenuItem";

export class Menu extends Phaser.GameObjects.Container {
    public menuItemIndex = 0;
    private menuItems:MenuItem[]=[];
    constructor(x: number, y: number, scene: Phaser.Scene, private heroes: Unit[]) {
        super(scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.x = x;
        this.y = y;
        this.build();
    }

    addMenuItem(unit:string) {
        const scale = 2;
        var menuItem = new MenuItem(
            0,
            scale * this.menuItems.length * 20,
            unit,
            this.scene
        );
        this.menuItems.push(menuItem);
        this.add(menuItem);
    }

    moveSelectionUp() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex--;
        if (this.menuItemIndex < 0) {
            this.menuItemIndex = this.menuItems.length - 1;
        }
        this.menuItems[this.menuItemIndex].select();
    }

    moveSelectionDown() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex++;
        if (this.menuItemIndex >= this.menuItems.length) {
            this.menuItemIndex = 0;
        }
        this.menuItems[this.menuItemIndex].select();
    }

    // select the menu as a whole and an element with index from it
    select(index:number) {
        if (!index) {
            index = 0;
        }
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        this.menuItems[this.menuItemIndex].select();
    }

    // deselect this menu
    deselect() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
    }

    confirm() {
        // when the player confirms his slection, do the action
    }

    clear() {
        for (var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    }

    build() {
        if (this.heroes) {
            for (var i = 0; i < this.heroes.length; i++) {
                var unit = this.heroes[i];
                this.addMenuItem(unit.name + " " + unit.hp);
            }
        }
    }

    refresh() {
        this.clear();
        this.build();
    }
}
