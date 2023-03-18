import Phaser from "phaser";
export const Text = () => ({
    create(scene, props) {
        const { text, style } = props;
        return new Phaser.GameObjects.Text(scene, 0, 0, text, style);
    },
    update(textObject, newProps) {
        const { text, style } = newProps;
        textObject.setText(text);
        textObject.setStyle(style);
    },
});
//# sourceMappingURL=Text.js.map