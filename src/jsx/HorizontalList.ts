import { Tag } from "@dragonquest/jsx/jsx-runtime";
import Phaser, { GameObjects, Scene } from "phaser";

export interface HorizontalListProps {
    gap: number;
}

// Phaser.GameObjects.Components.Alpha, Phaser.GameObjects.Components.BlendMode, Phaser.GameObjects.Components.ComputedSize, Phaser.GameObjects.Components.Crop, Phaser.GameObjects.Components.Depth, Phaser.GameObjects.Components.Flip, Phaser.GameObjects.Components.GetBounds, Phaser.GameObjects.Components.Mask, Phaser.GameObjects.Components.Origin, Phaser.GameObjects.Components.Pipeline, Phaser.GameObjects.Components.ScrollFactor, Phaser.GameObjects.Components.Tint, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible

class HorizontalListContainer extends Phaser.GameObjects.Container {
    constructor(scene: Scene, private props: HorizontalListProps) {
        super(scene, 0, 0);
    }
    add(child: GameObjects.GameObject) {
        const length = this.getAll().length;
        const width = this.getAll().reduce((w, child, idx) => {
            w +=
                (child as unknown as Phaser.GameObjects.Components.GetBounds).getBounds()
                    .width + this.props.gap;

            return w;
        }, 0);
        (child as unknown as Phaser.GameObjects.Components.Transform).setX(
            width
        );
        super.add(child);
        return this;
    }
}

export const HorizontalList: Tag<HorizontalListProps> = () => ({
    create(scene: Scene, props: HorizontalListProps) {
        return new HorizontalListContainer(scene, props);
    },
    update(
        container: Phaser.GameObjects.Container,
        props: HorizontalListProps
    ) {return false;},
});
