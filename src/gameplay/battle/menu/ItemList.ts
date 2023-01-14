import { ItemListSettings } from "./ItemListSettings";
import { ObservableItemModel } from "./ObservableItemModel";
import { TextItem } from "./TextItem";

export interface ListModel {
    items: ObservableItemModel[];
}

export class ItemList extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        private config: ItemListSettings,
        private model: ListModel
    ) {
        super(scene, x, y);

        const itemconfig = {
            ...config,
            width: config.width - 2 * config.padding.x,
        };

        let nextY = config.padding.y;
        model.items.forEach((i) => {
            const item = new TextItem(
                scene,
                config.padding.x,
                nextY,
                itemconfig,
                i
            );
            this.add(item)
            nextY = nextY+item.getBounds().height+config.marginBetweenItems;
        });

        const height = this.getBounds().height;

        const border = new Phaser.GameObjects.Rectangle(
            scene,
            config.width/2,
            height/2+config.padding.y,
            
            config.width,
            height + 2 * config.padding.y,
            config.bgColor
        );
        border.setStrokeStyle(3,0xFF0000)
        this.add(border);

      
    }
}
