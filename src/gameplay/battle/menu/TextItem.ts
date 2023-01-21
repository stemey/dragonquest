import { autorun } from "mobx";
import { ObservableItemModel } from "./ObservableItemModel";
import { ItemSettings } from "./ItemSettings";
import { Scene } from "phaser";

export class TextItem extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        private config: ItemSettings,
        private item: ObservableItemModel
    ) {
        super(scene, x, y);

        const text = new Phaser.GameObjects.Text(
            scene,
            config.padding.left,
            config.padding.top,
            item.text,
            {
                color: Phaser.Display.Color.IntegerToColor(config.textColor)
                    .rgba,
                align: "left",
                fontSize: config.fontSize,
                fixedWidth: config.width - 2 * config.padding.left,
            }
        );
        this.add(text);
        const height = text.getBounds().height;
        const border = new Phaser.GameObjects.Rectangle(
            scene,
            config.width / 2,
            height / 2 + config.padding.top,
            config.width,
            height +  config.padding.left,
            config.bgColor
        );
        border.setStrokeStyle(3, 0xff0000);

        this.add(border);

        autorun(() => {  
            text.setText(this.item.text);
            if (this.item.selected) {
                border.strokeColor = this.config.selectedBorderColor;
                text.setColor(
                    Phaser.Display.Color.IntegerToColor(
                        this.config.selectedBorderColor
                    ).rgba
                );
            } else {
                border.strokeColor = this.config.textColor;
                text.setColor(
                    Phaser.Display.Color.IntegerToColor(this.config.textColor)
                        .rgba
                );
            }
        });
    }
}
