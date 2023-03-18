import Phaser from "phaser";
import { Tag } from "./jsx-runtime";
export interface TextProps {
    text: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
}
export declare const Text: Tag<TextProps>;
