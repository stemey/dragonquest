export interface GameObjectFactory<P extends object, T, S> {
    create(scene: S, props: P): T;
    update(gameObject: T, props: P): boolean;
}