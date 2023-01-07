import { AbstractWorld } from "../../scenes/AbstractWorld";
import { LayerObject } from "./LayerObject";

export type Action<T> = (object: LayerObject<T>, scene: AbstractWorld) => void;
