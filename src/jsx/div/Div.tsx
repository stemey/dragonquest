import { GameObjects } from "phaser";
import { getBounds } from "../utils";
import { DivProps } from "./DivProps";
import { useState } from "@dragonquest/jsx/jsx-runtime";
import { phaserJsxHelper } from "../phaserJsxHelper";
import { Container } from "../Container";
import { Rectangle } from "../Rectangle";

export const Div = (props: DivProps) => {
    const [ref, setRef] = useState<GameObjects.Container | undefined>(
        undefined
    );
    const refCallback = (aref: GameObjects.Container) => {
        if (!ref) {
            setRef(aref);
        }
    };
    const x = props.x || 0;
    const y = props.y || 0;
    let currentHeight = props.height || 0;
    let currentWidth = props.width || 0;
    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];
    if (ref) {
        children.forEach((c, idx) => {
            if (!c) {
                return;
            }
            const child = phaserJsxHelper.get(ref, idx);
            const bounds = getBounds(child);
            if (typeof props.height === "undefined") {
                currentHeight += bounds?.height || 0;
            }
            if (typeof props.width === "undefined") {
                currentWidth += bounds?.width || 0;
            }
        });
    }

    children.forEach((c, idx) => {
        if (!c) {
            return;
        }
        c.props.x = props.padding.left
        c.props.y = props.padding.top
        if (!c.props.width) {
            c.props.width = currentWidth-props.padding.left-props.padding.right
        } 
        if (!c.props.height) {
            c.props.height = currentHeight-props.padding.top-props.padding.bottom
        } 
    });


    return (
        <Container
            x={x + props.margin.left}
            y={y + props.margin.right}
            ref={refCallback}
        >
            <Rectangle
                x={0}
                y={0}
                width={currentWidth}
                height={currentHeight}
                fillAlpha={props.fillAlpha}
                fillColor={props.fillColor}
            />
            {props.children}
        </Container>
    );
};