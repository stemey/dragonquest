import { ObservableItemModel } from "./ObservableItemModel";
import { ItemSettings } from "./ItemSettings";
import { Text } from "../../../jsx/Text";
import { observer } from "./Observer";
import { Transform } from "../../../jsx/Transform";

export const Item = observer(
    (props: {
        config: ItemSettings;
        item: ObservableItemModel;
        x?: number;
        y?: number;
    }) => {
        const { config, item } = props;
        const color = item.selected
            ? Phaser.Display.Color.IntegerToColor(config.textColor).rgba
            : Phaser.Display.Color.IntegerToColor(config.selectedBorderColor)
                  .rgba;

        const mode = item.selected ? "in" : "out";

        return (
            <Transform mode={mode}>
                <Text
                    x={props.x}
                    y={props.y}
                    text={item.text}
                    style={{ color,fontSize:config.fontSize }}
                />
            </Transform>
        );
    }
);
