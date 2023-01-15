import { Scene } from "phaser";
import { Element } from "./Element";
export declare const create: (scene: Scene, element: Element) => Phaser.GameObjects.GameObject;
export declare const reconcile: (old: Element, nu: Element, gameObject: Phaser.GameObjects.GameObject) => void;
