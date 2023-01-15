import { Tag } from "@dragonquest/jsx/jsx-runtime";
import Phaser, { GameObjects, Scene } from "phaser";

export interface VerticalListProps {
    verticalGap: number;
}

// Phaser.GameObjects.Components.Alpha, Phaser.GameObjects.Components.BlendMode, Phaser.GameObjects.Components.ComputedSize, Phaser.GameObjects.Components.Crop, Phaser.GameObjects.Components.Depth, Phaser.GameObjects.Components.Flip, Phaser.GameObjects.Components.GetBounds, Phaser.GameObjects.Components.Mask, Phaser.GameObjects.Components.Origin, Phaser.GameObjects.Components.Pipeline, Phaser.GameObjects.Components.ScrollFactor, Phaser.GameObjects.Components.Tint, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible

class VerticalListContainer extends Phaser.GameObjects.Container {
    constructor(scene: Scene, private props: VerticalListProps) {
        super(scene, 0, 0);
    }
    add(child: GameObjects.GameObject) {
        const length = this.getAll().length;
        const height = this.getAll().reduce((h, child, idx) => {
            h +=
                (child as unknown as Phaser.GameObjects.Components.GetBounds).getBounds()
                    .height + this.props.verticalGap;

            return h;
        }, 0);
        (child as unknown as Phaser.GameObjects.Components.Transform).setY(
            height
        );
        super.add(child);
        return this;
    }
}

export const VerticalList: Tag<VerticalListProps> = () => ({
    create(scene: Scene, props: VerticalListProps) {
        return new VerticalListContainer(scene, props);
    },
    update(
        container: Phaser.GameObjects.Container,
        props: VerticalListProps
    ) {},
});
