import Phaser from "phaser";
export const Container = () => ({
    create(scene, props) {
        const { x, y } = props;
        return new Phaser.GameObjects.Container(scene, x, y);
    },
    update(container, props) {
        const { x, y } = props;
        container.setX(x);
        container.setY(y);
    },
});
//# sourceMappingURL=Container.js.map