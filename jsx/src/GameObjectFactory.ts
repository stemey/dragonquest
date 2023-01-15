import { Scene } from "phaser";

export interface GameObjectFactory<
    P extends object,
    T extends Phaser.GameObjects.GameObject
> {
    create(scene: Scene, props: P): T;

    update(gameObject: T, props: P): void;
}
