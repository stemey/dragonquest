import { Scene } from "phaser";
import { Element } from "./Element";
export declare const create: (scene: Scene, element: Element<any>) => Phaser.GameObjects.GameObject;
export declare const reconcile: (scene: Scene, old: Element<any> | undefined, nu: Element<any>, gameObject: Phaser.GameObjects.GameObject) => Phaser.GameObjects.GameObject | undefined;
