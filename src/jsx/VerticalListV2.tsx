import { Element, useState } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "./Container";
import { phaserJsxHelper } from "./phaserJsxHelper";
import { getBounds } from "./utils";

export const VerticalListV2 = (props: {
    x?: number;
    y?: number;
    width?: number;
    children?: Element<{}>[];
}) => {
    const children = props.children || [];
    const [ref, setRef] = useState<GameObjects.Container | undefined>(
        undefined
    );
    const refCallback = (aref: GameObjects.Container) => {
        if (!ref) {
            setRef(aref);
        }
    };
    if (ref) {
        let currentHeight = 0;
        children.forEach((c, idx) => {
            const child = phaserJsxHelper.get(ref, idx);
            const height = getBounds(child)?.height || 0;
            c.props.y = currentHeight;
            c.props.x = 10;
            currentHeight += height;
        });
    } else {
    }
    children?.forEach((c, idx) => {
        if (props.width && !c.props.width) {
            c.props.width = props.width;
        }
    });

    return (
        <Container x={props.x} y={props.y} ref={refCallback}>
            {children}
        </Container>
    );
};
