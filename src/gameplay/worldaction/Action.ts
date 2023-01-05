import { AbstractWorld } from "../../scenes/AbstractWorld";
import { LayerObject } from "./LayerObject";

export type Action = (object: LayerObject, scene: AbstractWorld) => void;
