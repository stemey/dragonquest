import { Gold, Key } from "./DropItem";

export type DropItemRef = PowerRef | Gold | Key;

export interface PowerRef {
    type: "power";
    name: string;
    count?: number;
}
