import { Element, useState } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "./Container";
import { phaserJsxHelper } from "./phaserJsxHelper";
import { getBounds } from "./utils";

export const HorizontalListV2 = (props: {
    x?: number;
    y?: number;
    children?: Element<{}>[];
}) => {
    const [ref, setRef] = useState<GameObjects.Container | undefined>(
        undefined
    );
    const refCallback = (aref: GameObjects.Container) => {
        if (!ref) {
            setRef(aref);
        }
    };
    if (ref) {
        let currentWidth = 0;
        props.children?.forEach((c, idx) => {
            const child = phaserJsxHelper.get(ref, idx);
            const width = getBounds(child)?.width || 0;
            c.props.x = currentWidth;
            if (!c.props.y) {
                c.props.y=0;
            }
            currentWidth += width;
        });
    }

    return (
        <Container x={props.x} y={props.y} ref={refCallback}>
            {props.children}
        </Container>
    );
};
