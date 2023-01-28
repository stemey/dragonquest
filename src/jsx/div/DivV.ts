import Phaser, { GameObjects, Scene, Tilemaps } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";
import { Padding } from "../../gameplay/battle/menu/Padding";
import { getBounds, setPosition } from "../utils";
import { JsxContainer } from "../JsxContainer";

export interface DivProps {
    area?: string;
    margin: Padding;
    padding: Padding;
    width?: number;
    height?: number;
    fillColor?: number;
    fillAlpha?: number;
    x?: number;
    y?: number;
}

export const DivV: Tag<DivProps> = () => ({
    create(scene: Scene, props: DivProps) {
        return new DivContainer(scene, props);
    },
    update(container: DivContainer, props: DivProps) {
        return container.updateProps(props);
    },
});

export class DivContainer
    extends Phaser.GameObjects.Container
    implements JsxContainer
{
    private rectangle: Phaser.GameObjects.Rectangle;
    private innerRectangle: Phaser.GameObjects.Rectangle;
    private currentContentHeight = 0;
    constructor(scene: Scene, private props: DivProps) {
        super(scene, props.x || 0, props.y || 0);
        props.width = props.width || 0;
        this.rectangle = new Phaser.GameObjects.Rectangle(
            scene,
            props.margin.left + props.width / 2,
            props.margin.top + (props.height || 0) / 2,
            props.width,
            props.height,
            props.fillColor,
            props.fillAlpha
        );
        //this.rectangle.visible = false;
        this.add(this.rectangle);
        this.innerRectangle = new Phaser.GameObjects.Rectangle(
            scene,
            (props.width + props.margin.left + props.margin.right) / 2,
            ((props.height || 0) + props.margin.top + props.margin.bottom) / 2,
            props.width + props.margin.left + props.margin.right,
            (props.height || 0) + props.margin.top + props.margin.bottom,
            props.fillColor,
            0.2
        );
        //this.rectangle.visible = false;
        this.add(this.innerRectangle);
        this.currentContentHeight = this.getContentHeight(props);
    }
    getAtJsx(idx: number): GameObjects.Container {
        //skip rectangle
        return this.getAt(idx + 2) as any;
    }
    add(child: GameObjects.GameObject) {
        if (this.rectangle == child || this.innerRectangle === child) {
            super.add(child);
            return this;
        }
        /*      setWidth(
            child,
            this.props.width -
                this.props.padding.left -
                this.props.padding.right
        );*/

        super.add(child);
        setPosition(
            child,
            this.props.margin.left + this.props.padding.left,
            this.props.margin.top + this.props.padding.top
        );
        const contentHeight = this.getContentHeight(this.props);
        this.updateHeight(this.props, contentHeight);

        return this;
    }
    updateProps(props: DivProps) {
        const contentHeight = this.getContentHeight(props);
        this.setPosition(props.x, props.y);
        this.each((c: GameObjects.GameObject) => {
            if (c === this.rectangle) {
                setPosition(
                    this.rectangle,
                    getX(props, false, props.width),
                    getY(props, false, contentHeight)
                );
                //setWidth(this.rectangle, props.width);
            } else if (c === this.innerRectangle) {
                setPosition(
                    this.innerRectangle,
                    getX(props, true, props.width),
                    getY(props, true, contentHeight)
                );
                //setWidth(this.rectangle, props.width);
            } else {
                /*  setWidth(
                    c,
                    this.props.width -
                        this.props.padding.left -
                        this.props.padding.right
                );*/
                setPosition(
                    c,
                    props.margin.left + props.padding.left,
                    props.margin.top + props.padding.top
                );
            }
        });
        this.props = props;
        this.updateHeight(props, contentHeight);
        this.innerRectangle.updateDisplayOrigin();
        this.rectangle.updateDisplayOrigin();

        const changed = this.currentContentHeight !== contentHeight;
        this.currentContentHeight = contentHeight;
        return changed;
    }

    getContentHeight(props: DivProps) {
        if (props.height) {
            return props.height;
        }
        let fullHeight = this.props.padding.top + this.props.padding.bottom;
        this.each((c: GameObjects.GameObject) => {
            if (c !== this.rectangle && c !== this.innerRectangle) {
                ///console.log("child y", (c as any).y);
                //console.log("child x", (c as any).x);

                fullHeight += getBounds(c)?.height || 0;
            }
        });
        return Math.round(fullHeight);
    }

    updateHeight(props: DivProps, contentHeight: number) {
        if (!props.height) {
            this.rectangle.setSize(
                getWidth(props, false, props.width),
                getHeight(props, false, contentHeight)
            );

            this.innerRectangle.setSize(
                getWidth(props, true, props.width),
                getHeight(props, true, contentHeight)
            );
        } else if (props.width && props.height) {
            this.innerRectangle.setSize(
                getWidth(props, true),
                getHeight(props, true)
            );
            this.rectangle.setSize(
                getWidth(props, false),
                getHeight(props, false)
            );
        }
    }
}

function getHeight(props: DivProps, full: boolean, contentHeight?: number) {
    let frame = props.padding.top + props.padding.bottom;
    if (full) frame += props.margin.top + props.margin.bottom;
    return (contentHeight || props.height || 1) + frame;
}
function getWidth(props: DivProps, full: boolean, contentWidth?: number) {
    let frame = props.padding.left + props.padding.right;
    if (full) frame += props.margin.left + props.margin.right;
    return (contentWidth || props.width || 1) + frame;
}
function getX(props: DivProps, full: boolean, contentWidth?: number) {
    if (full) {
        return Math.round(getWidth(props, full, contentWidth) / 2);
    } else {
        return Math.round(
            getWidth(props, full, contentWidth) / 2 + props.margin.left
        );
    }
}
function getY(props: DivProps, full: boolean, contentHeight?: number) {
    if (full) {
        return Math.round(getHeight(props, full, contentHeight) / 2);
    } else {
        return Math.round(
            getHeight(props, full, contentHeight) / 2 + props.margin.top
        );
    }
}
