import * as Phaser from "phaser";
import { DialogState } from "../gameplay/dialog/DialogState";
import { DragonQuest } from "../gameplay/DragonQuest";
import { autorun } from "mobx";

export class DialogUi extends Phaser.GameObjects.Container {
    private text: Phaser.GameObjects.Text;
    private dialogState: DialogState;
    private graphics: Phaser.GameObjects.Graphics;
    private group: Phaser.GameObjects.Container;
    constructor(
        scene: Phaser.Scene,
        private events: Phaser.Events.EventEmitter,
        x?: number,
        y?: number
    ) {
        super(scene, 0, 0);
        this.graphics = this.scene.add.graphics();

        this.add(this.graphics);
        this.text = new Phaser.GameObjects.Text(scene, 160, 30, "", {
            color: "#ffffff",
            align: "center",
            fontSize: "20px",
            wordWrap: { width: 400, useAdvancedWrap: true },
        });
        this.add(this.text);
        this.group = new Phaser.GameObjects.Container(this.scene);
        this.add(this.group);
        //this.text.setOrigin(1);
        this.events.on("DialogStart", this.startDialog, this);
        this.visible = false;
        this.dialogState = new DialogState();
    }

    update(): void {
        const padding = 10;
        const bounds = this.text.getBounds();
        const groupBounds = this.group.getBounds();
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xffffff, 0.8);
        this.graphics.fillStyle(0x031f4c, 0.3);
        this.graphics.strokeRect(
            bounds.x - padding,
            bounds.y - padding,
            bounds.width + 2 * padding,
            bounds.height + groupBounds.height + 2 * padding
        );
        this.graphics.fillRect(
            bounds.x - padding,
            bounds.y - padding,
            bounds.width + 2 * padding,
            bounds.height + groupBounds.height + 2 * padding
        );
        const messageState = this.dialogState?.getState();
        if (messageState?.options) {
            const index = messageState.selectedIndex;
            const selectedBounds = (
                this.group.getAll()[index] as Phaser.GameObjects.Text
            ).getBounds();
            this.graphics.fillStyle(0xff0000, 0.8);
            this.graphics.fillRect(
                selectedBounds.x,
                selectedBounds.y,
                selectedBounds.width,
                selectedBounds.height
            );
        }
    }

    startDialog = (dialogId: string) => {
        if (this.dialogState?.conversing) {
            return;
        }
        const dialog = DragonQuest.getDialog(dialogId);
        this.dialogState.startDialog(dialog);

        autorun(() => {
            const messageState = this.dialogState?.getState();
            if (messageState) {
                const text = messageState.text;
                if (messageState.options) {
                    const bounds = this.text.getBounds();
                    let height = 0;
                    messageState.options.forEach((o, idx) => {
                        const option = new Phaser.GameObjects.Text(
                            this.scene,
                            bounds.x,
                            bounds.y + bounds.height + height,
                            o.text,
                            {
                                color: "#ffffff",
                                align: "center",
                                fontSize: "20px",
                                wordWrap: { width: 400, useAdvancedWrap: true },
                            }
                        );
                        height += option.getBounds().height;
                        this.group.add(option);
                    });
                } else {
                    this.group.removeAll(true);
                }
                this.text.setText(text);
            } else {
                this.visible = false;
                this.events.emit("DialogEnd");
                console.log("finished conversation");
            }
        });
        this.visible = true;
    };

    hideMessage() {
        this.visible = false;
    }

    onKey = (event: KeyboardEvent) => {
        if (this.dialogState) {
            if (event.code === "ArrowUp") {
                this.dialogState.onArrowUp();
            }
            if (event.code === "ArrowDown") {
                this.dialogState.onArrowDown();
            }
            if (event.code === "Space") {
                this.dialogState.onSpace();
            }
        }
    };
}
