import { Ref, Tag } from "@dragonquest/jsx/jsx-runtime";
import { Curves, GameObjects, Scene, Textures } from "phaser";

export interface FollowerProps {
    path: Curves.Path;
    x?: number;
    y?: number;
    alpha?: number;
    scale?: number;
    texture: string | Textures.Texture;
    ref?: Ref<GameObjects.PathFollower>;
}

function update(
    container: Phaser.GameObjects.PathFollower,
    props: FollowerProps
) {
    container.setAlpha(props.alpha || 1);
    container.setScale(props.scale || 1);
    return false;
}

export const Follower: Tag<FollowerProps> = () => ({
    create(scene: Scene, props: FollowerProps) {
        const { path, x = 0, y = 0, texture } = props;
        const follower = scene.add.follower(
            path,
            x,
            y,
            texture
        );

        
        update(follower, props);
        return follower;
    },
    update,
});
