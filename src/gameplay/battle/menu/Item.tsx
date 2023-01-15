import { ObservableItemModel } from "./ObservableItemModel";
import { ItemSettings } from "./ItemSettings";
import { Text } from "../../../jsx/Text";
import { observer } from "./Observer";

export const Item = observer((props: {
    config: ItemSettings;
    item: ObservableItemModel;
}) =>{
    const { config, item } = props;
    const color = item.selected ? Phaser.Display.Color.IntegerToColor(config.textColor).rgba: Phaser.Display.Color.IntegerToColor(config.selectedBorderColor).rgba;
    
    return <Text text={item.text} style={{ color }} />;
})
