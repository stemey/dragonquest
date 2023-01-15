import { ObservableItemModel } from "./ObservableItemModel";
import { ItemSettings } from "./ItemSettings";
import { Text } from "@dragonquest/jsx";

export function Item(props: {
    config: ItemSettings;
    item: ObservableItemModel;
}) {
    const { config, item } = props;
    const color = Phaser.Display.Color.IntegerToColor(config.textColor).rgba;
    return <Text text={item.text} style={{ color }} />;
}
