import { Tag } from "@dragonquest/jsx/jsx-runtime";
import Phaser, { GameObjects, Scene } from "phaser";
import { getBounds, setPosition, setWidth } from "./utils";

export interface VerticalListProps {
    verticalGap: number;
    width?: number;
    x?: number;
    y?: number;
}

// Phaser.GameObjects.Components.Alpha, Phaser.GameObjects.Components.BlendMode, Phaser.GameObjects.Components.ComputedSize, Phaser.GameObjects.Components.Crop, Phaser.GameObjects.Components.Depth, Phaser.GameObjects.Components.Flip, Phaser.GameObjects.Components.GetBounds, Phaser.GameObjects.Components.Mask, Phaser.GameObjects.Components.Origin, Phaser.GameObjects.Components.Pipeline, Phaser.GameObjects.Components.ScrollFactor, Phaser.GameObjects.Components.Tint, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible

class VerticalListContainer extends Phaser.GameObjects.Container {
    constructor(scene: Scene, private props: VerticalListProps) {
        super(scene, props.x || 0, props.y || 0);
    }

    add(child: GameObjects.GameObject | GameObjects.GameObject[]) {
        const height = this.getAll().reduce((h, child, idx) => {
            h +=
                (
                    child as unknown as Phaser.GameObjects.Components.GetBounds
                ).getBounds().height + this.props.verticalGap;

            return h;
        }, 0);
        (child as unknown as Phaser.GameObjects.Components.Transform).setY(
            height
        );
        if (this.props.width) {
            // setWidth(child, this.props.width);
        }

        super.add(child);
        return this;
    }

    preUpdate = () => {
        console.log("preupdate");
    };

    updateXX() {
        let currentHeight = 0;
        this.getAll().forEach((h, idx) => {
            const bounds = getBounds(h);
            if (bounds) {
                currentHeight += bounds.height;
            }
            setPosition(h, 0, currentHeight);
            console.log("vl", currentHeight, idx);
        });
        super.update();
    }
}

export const VerticalList: Tag<VerticalListProps> = () => ({
    create(scene: Scene, props: VerticalListProps) {
        return new VerticalListContainer(scene, props);
    },
    update(container: Phaser.GameObjects.Container, props: VerticalListProps) {
        if (props.width) {
            container.each((c: Phaser.GameObjects.GameObject) => {
                //setWidth(c, props.width);
            });
        }
        container.setPosition(props.x || 0, props.y || 0);
        return false;
    },
});
