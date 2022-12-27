import { BasePower } from "./Power";

export interface Healing extends BasePower {
    type: "heal";
    healing:number;
}
