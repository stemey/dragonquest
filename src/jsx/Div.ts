import Phaser, { GameObjects, Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";
import { Padding } from "../gameplay/battle/menu/Padding";
import { getBounds, setPosition, setWidth } from "./utils";
import { JsxContainer } from "./JsxContainer";

export interface DivProps {
    margin: Padding;
    padding: Padding;
    width: number;
    height?: number;
    fillColor?: number;
    fillAlpha?: number;
}

export const Div: Tag<DivProps> = () => ({
    create(scene: Scene, props: DivProps) {
        return new DivContainer(scene, props);
    },
    update(container: DivContainer, props: DivProps) {
        container.updateProps(props);
    },
});

export class DivContainer
    extends Phaser.GameObjects.Container
    implements JsxContainer
{
    private rectangle: Phaser.GameObjects.Rectangle;
    constructor(scene: Scene, private props: DivProps) {
        super(scene, 0, 0);
        this.rectangle = new Phaser.GameObjects.Rectangle(
            scene,
            props.margin.left + props.width / 2,
            props.margin.top,
            props.width,
            props.height,
            props.fillColor,
            props.fillAlpha
        );
        this.add(this.rectangle);
    }
    getAtJsx(idx: number): GameObjects.Container {
        //skip rectangle
        return this.getAt(idx + 1) as any;
    }
    add(child: GameObjects.GameObject) {
        if (this.rectangle == child) {
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
        this.updateHeight();

        return this;
    }
    updateProps(props: DivProps) {
        this.each((c: GameObjects.GameObject) => {
            if (c === this.rectangle) {
                /*setPosition(
                    this.rectangle,
                    props.margin.left,
                    props.margin.top
                );*/
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
                    this.props.margin.left + this.props.padding.left,
                    this.props.margin.top + this.props.padding.top
                );
            }
        });
        this.props = props;
        this.updateHeight();
    }

    update() {
        super.update();
        this.rectangle.update();
    }

    updateHeight() {
        if (!this.props.height) {
            let fullHeight = this.props.padding.top + this.props.padding.bottom;
            this.each((c: GameObjects.GameObject) => {
                if (c !== this.rectangle) {
                    ///console.log("child y", (c as any).y);
                    //console.log("child x", (c as any).x);

                    fullHeight += getBounds(c)?.height || 0;
                }
            });
            this.rectangle.setDisplaySize(this.props.width, fullHeight);
            this.rectangle.setY(
                fullHeight / 2 + this.props.margin.top
            );
            console.log("height", fullHeight);
            console.log("y", this.rectangle.y);
        }
    }
}
